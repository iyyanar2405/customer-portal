import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { filter, map, tap } from 'rxjs';

import {
  BarChartModel,
  DoughnutChartModel,
  DrillDownFilterColumnMapping,
  EMPTY_GRAPH_DATA,
  extractAppliedFilters,
  extractLocationChartFilters,
  formatFilter,
  getDateMinusDays,
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
  shouldApplyFilter,
  TreeColumnDefinition,
} from '@customer-portal/shared';

import { FindingChartFilterKey } from '../constants';
import {
  FindingGraphsFilterCompaniesDto,
  FindingGraphsFilterServicesDto,
  FindingGraphsFilterSitesDto,
  FindingsTrendsGraphDto,
} from '../dtos';
import {
  FindingByClauseStatus,
  FindingTabs,
  FindingTrendsGraphModel,
  OpenFindingsMonthsPeriod,
  OpenFindingsResponse,
} from '../models';
import { FindingGraphsMapperService, FindingGraphsService } from '../services';
import {
  CreateFindingsByClauseDataGradient,
  CreateFindingsBySiteListGradient,
  CreateFindingsDataTrendsColumns,
  CreateFindingsDataTrendsGradient,
  LoadBecomingOverdueFindingsGraphData,
  LoadBecomingOverdueFindingsGraphDataSuccess,
  LoadEarlyStageFindingsGraphData,
  LoadEarlyStageFindingsGraphDataSuccess,
  LoadFindingChartFilterCompanies,
  LoadFindingChartFilterCompaniesSuccess,
  LoadFindingChartFilterList,
  LoadFindingChartFilterServices,
  LoadFindingChartFilterServicesSuccess,
  LoadFindingChartFilterSites,
  LoadFindingChartFilterSitesSuccess,
  LoadFindingsByClauseList,
  LoadFindingsByClauseListSuccess,
  LoadFindingsBySiteList,
  LoadFindingsBySiteListSuccess,
  LoadFindingsByStatusGraphData,
  LoadFindingsByStatusGraphDataSuccess,
  LoadFindingsDataTrends,
  LoadFindingsDataTrendsSuccess,
  LoadFindingsGraphsData,
  LoadFindingStatusByCategoryGraphData,
  LoadFindingStatusByCategoryGraphDataSuccess,
  LoadFindingsTrendsGraphData,
  LoadFindingsTrendsGraphDataSuccess,
  LoadInProgressFindingsGraphData,
  LoadInProgressFindingsGraphDataSuccess,
  LoadOpenFindingsGraphData,
  LoadOverdueFindingsGraphData,
  LoadOverdueFindingsGraphDataSuccess,
  NavigateFromChartToListView,
  NavigateFromTreeTableToListView,
  ResetFindingsByClauseList,
  ResetFindingsBySiteList,
  ResetFindingsGraphData,
  ResetFindingsGraphsState,
  ResetFindingStatusGraphData,
  ResetFindingTrendsGraphData,
  ResetOpenFindingsGraphData,
  SetActiveFindingsTab,
  SetNavigationGridConfig,
  UpdateFindingChartFilterByKey,
  UpdateFindingChartFilterCompanies,
  UpdateFindingChartFilterServices,
  UpdateFindingChartFilterSites,
  UpdateFindingChartFilterTimeRange,
  UpdateOpenFindingsResponse,
} from './actions';

export interface FindingGraphsStateModel {
  activeTab: FindingTabs;
  becomingOverdueFindingsGraphData: BarChartModel;
  earlyStageFindingsGraphData: BarChartModel;
  findingsTrendsGraphData: FindingTrendsGraphModel;
  findingsByStatusGraphData: DoughnutChartModel;
  findingStatusByCategoryGraphData: BarChartModel;
  findingsByClauseList: TreeNode[];
  findingsByClauseListGradient: { [key: string]: Map<number, string> };
  findingsBySiteList: TreeNode[];
  findingsBySiteListGradient: { [key: string]: Map<number, string> };
  findingsTrendsColumns: TreeColumnDefinition[];
  findingsTrendsData: TreeNode[];
  findingsTrendsGradient: Map<number, string>;
  inProgressFindingsGraphData: BarChartModel;
  openFindingsResponse: OpenFindingsResponse;
  overdueFindingsGraphData: BarChartModel;
  filterStartDate: Date;
  filterEndDate: Date;
  filterCompanies: number[];
  filterServices: number[];
  filterSites: number[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataSites: TreeNode[];
  prefillCompanies: number[];
  prefillServices: number[];
  prefillSites: TreeNode[];
}

const defaultState: FindingGraphsStateModel = {
  activeTab: FindingTabs.FindingStatus,
  becomingOverdueFindingsGraphData: EMPTY_GRAPH_DATA,
  earlyStageFindingsGraphData: EMPTY_GRAPH_DATA,
  findingsTrendsGraphData: EMPTY_GRAPH_DATA,
  findingsByStatusGraphData: EMPTY_GRAPH_DATA,
  findingStatusByCategoryGraphData: EMPTY_GRAPH_DATA,
  findingsByClauseList: [],
  findingsByClauseListGradient: {},
  findingsBySiteList: [],
  findingsBySiteListGradient: {},
  findingsTrendsColumns: [],
  findingsTrendsData: [],
  findingsTrendsGradient: new Map<number, string>(),
  inProgressFindingsGraphData: EMPTY_GRAPH_DATA,
  openFindingsResponse: OpenFindingsResponse.NoResponse,
  overdueFindingsGraphData: EMPTY_GRAPH_DATA,
  filterStartDate: new Date(),
  filterEndDate: new Date(),
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  prefillCompanies: [],
  prefillServices: [],
  prefillSites: [],
};

@State<FindingGraphsStateModel>({
  name: 'findingGraphs',
  defaults: defaultState,
})
@Injectable()
export class FindingGraphsState {
  constructor(private readonly findingGraphsService: FindingGraphsService) {}

  // #region FindingGraphState
  @Action(ResetFindingsGraphsState)
  resetFindingsGraphsState(ctx: StateContext<FindingGraphsStateModel>) {
    ctx.setState(defaultState);
  }
  // #endregion FindingGraphState

  // #region FindingsTabs
  @Action(SetActiveFindingsTab)
  setActiveFindingsTab(
    ctx: StateContext<FindingGraphsStateModel>,
    { activeTab }: SetActiveFindingsTab,
  ) {
    ctx.patchState({ activeTab });
  }

  @Action(ResetFindingsGraphData)
  resetFindingsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [FindingTabs.FindingStatus]: [
        new ResetOpenFindingsGraphData(),
        new ResetFindingTrendsGraphData(),
      ],
      [FindingTabs.OpenFindings]: [
        new ResetFindingStatusGraphData(),
        new ResetFindingTrendsGraphData(),
      ],
      [FindingTabs.Trends]: [
        new ResetFindingStatusGraphData(),
        new ResetOpenFindingsGraphData(),
      ],
      [FindingTabs.FindingsByClause]: [new ResetFindingsByClauseList()],
      [FindingTabs.FindingsBySite]: [new ResetFindingsBySiteList()],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  // #endregion FindingsTabs

  // #region FindingGraphsData
  @Action(LoadFindingsGraphsData)
  loadFindingsGraphsData(ctx: StateContext<FindingGraphsStateModel>) {
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [FindingTabs.FindingStatus]: [
        new LoadFindingsByStatusGraphData(),
        new LoadFindingStatusByCategoryGraphData(),
      ],
      [FindingTabs.OpenFindings]: [new LoadOpenFindingsGraphData()],
      [FindingTabs.Trends]: [
        new LoadFindingsTrendsGraphData(),
        new LoadFindingsDataTrends(),
      ],
      [FindingTabs.FindingsByClause]: [new LoadFindingsByClauseList()],
      [FindingTabs.FindingsBySite]: [new LoadFindingsBySiteList()],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  // #endregion FindingGraphsData

  // #region FindingsGraphsNavigation
  @Action(NavigateFromChartToListView)
  navigateFromChartToListView(
    ctx: StateContext<FindingGraphsStateModel>,
    { tooltipFilters }: NavigateFromChartToListView,
  ) {
    const state = ctx.getState();
    const {
      activeTab,
      filterStartDate,
      filterEndDate,
      dataServices,
      filterServices,
      dataCompanies,
      filterCompanies,
      prefillSites,
    } = state;

    const filterColumnMappings: DrillDownFilterColumnMapping = {
      date: 'openDate',
      services: 'services',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
    };

    const daysOffset = 90;
    const dateFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.date,
    )
      ? formatFilter(
          [
            filterStartDate,
            activeTab === FindingTabs.OpenFindings
              ? getDateMinusDays(daysOffset)
              : filterEndDate,
          ],
          filterColumnMappings.date,
        )
      : [];

    const serviceFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.services,
    )
      ? extractAppliedFilters(
          dataServices,
          filterServices,
          filterColumnMappings.services,
        )
      : [];

    const companyFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.companyName,
    )
      ? extractAppliedFilters(
          dataCompanies,
          filterCompanies,
          filterColumnMappings.companyName,
        )
      : [];

    const locationFilters = extractLocationChartFilters(prefillSites);

    const citiesFilters = formatFilter(
      locationFilters.cities,
      filterColumnMappings.cities,
    );

    const siteFilters = formatFilter(
      locationFilters.sites,
      filterColumnMappings.sites,
    );

    const updatedFilters = [
      ...tooltipFilters,
      ...dateFilters,
      ...serviceFilters,
      ...citiesFilters,
      ...siteFilters,
      ...companyFilters,
    ];

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/findings']));
  }

  @Action(NavigateFromTreeTableToListView)
  navigateFromTreeTableToListView(
    ctx: StateContext<FindingGraphsStateModel>,
    { selectionValues }: NavigateFromTreeTableToListView,
  ) {
    const state = ctx.getState();
    const {
      filterStartDate,
      filterEndDate,
      dataCompanies,
      filterCompanies,
      dataServices,
      filterServices,
      prefillSites,
    } = state;

    const filterColumnMappings: Partial<DrillDownFilterColumnMapping> = {
      date: 'openDate',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
      services: 'services',
    };

    const dateFilters = shouldApplyFilter(
      selectionValues,
      filterColumnMappings.date!,
    )
      ? formatFilter(
          [filterStartDate, filterEndDate],
          filterColumnMappings.date!,
        )
      : [];

    const serviceFilters = shouldApplyFilter(
      selectionValues,
      filterColumnMappings.services!,
    )
      ? extractAppliedFilters(
          dataServices,
          filterServices,
          filterColumnMappings.services!,
        )
      : [];

    const companyFilters = shouldApplyFilter(
      selectionValues,
      filterColumnMappings.companyName!,
    )
      ? extractAppliedFilters(
          dataCompanies,
          filterCompanies,
          filterColumnMappings.companyName!,
        )
      : [];

    const locationFilters = extractLocationChartFilters(prefillSites);

    const citiesFilters = formatFilter(
      locationFilters.cities,
      filterColumnMappings.cities!,
    );

    const siteFilters = formatFilter(
      locationFilters.sites,
      filterColumnMappings.sites!,
    );

    const updatedFilters = [
      ...selectionValues,
      ...dateFilters,
      ...citiesFilters,
      ...siteFilters,
      ...companyFilters,
      ...serviceFilters,
    ];

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/findings']));
  }

  // #endregion FindingsGraphsNavigation

  // #region FindingStatusGraphs
  @Action(LoadFindingStatusByCategoryGraphData)
  loadFindingStatusByCategoryGraphData(
    ctx: StateContext<FindingGraphsStateModel>,
  ) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.findingGraphsService
      .getFindingStatusByCategoryGraphData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((findingByCategoryGraphDto) => {
          const findingsByCategoryGraphData =
            FindingGraphsMapperService.mapToFindingStatusByCategoryGraphModel(
              findingByCategoryGraphDto,
            );

          ctx.dispatch(
            new LoadFindingStatusByCategoryGraphDataSuccess(
              findingsByCategoryGraphData,
            ),
          );
        }),
      );
  }

  @Action(LoadFindingStatusByCategoryGraphDataSuccess)
  loadFindingStatusByCategoryGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    {
      findingStatusByCategoryGraphData,
    }: LoadFindingStatusByCategoryGraphDataSuccess,
  ) {
    ctx.patchState({ findingStatusByCategoryGraphData });
  }

  @Action(LoadFindingsByStatusGraphData)
  loadFindingsByStatusGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.findingGraphsService
      .getFindingsByStatusGraphData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((findingsByStatusGraphDto) => {
          const findingsByStatusGraphData =
            FindingGraphsMapperService.mapToFindingsByStatusGraphModel(
              findingsByStatusGraphDto,
            );

          ctx.dispatch(
            new LoadFindingsByStatusGraphDataSuccess(findingsByStatusGraphData),
          );
        }),
      );
  }

  @Action(LoadFindingsByStatusGraphDataSuccess)
  loadFindingsByStatusGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { findingsByStatusGraphData }: LoadFindingsByStatusGraphDataSuccess,
  ) {
    ctx.patchState({
      findingsByStatusGraphData,
    });
  }

  @Action(ResetFindingStatusGraphData)
  resetFindingStatusGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    ctx.patchState({
      findingsByStatusGraphData: EMPTY_GRAPH_DATA,
      findingStatusByCategoryGraphData: EMPTY_GRAPH_DATA,
    });
  }
  // #endregion FindingStatusGraphs

  // #region OpenFindingsGraphs
  @Action(LoadOpenFindingsGraphData)
  loadOpenFindingsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    ctx.dispatch(new LoadOverdueFindingsGraphData());
    ctx.dispatch(new LoadBecomingOverdueFindingsGraphData());
    ctx.dispatch(new LoadInProgressFindingsGraphData());
    ctx.dispatch(new LoadEarlyStageFindingsGraphData());
  }

  @Action(LoadOverdueFindingsGraphData)
  loadOverdueFindingsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
      openFindingsResponse,
    } = ctx.getState();

    return this.findingGraphsService
      .getOpenFindingsGraphData(
        OpenFindingsMonthsPeriod.Overdue,
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
        openFindingsResponse,
      )
      .pipe(
        tap((openFindingsGraphDto) => {
          const openFindingsGraphData =
            FindingGraphsMapperService.mapToOpenFindingsGraphModel(
              openFindingsGraphDto,
            );

          ctx.dispatch(
            new LoadOverdueFindingsGraphDataSuccess(openFindingsGraphData),
          );
        }),
      );
  }

  @Action(LoadOverdueFindingsGraphDataSuccess)
  loadOverdueFindingsGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { overdueFindingsGraphData }: LoadOverdueFindingsGraphDataSuccess,
  ) {
    ctx.patchState({ overdueFindingsGraphData });
  }

  @Action(LoadBecomingOverdueFindingsGraphData)
  loadBecomingOverdueFindingsGraphData(
    ctx: StateContext<FindingGraphsStateModel>,
  ) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
      openFindingsResponse,
    } = ctx.getState();

    return this.findingGraphsService
      .getOpenFindingsGraphData(
        OpenFindingsMonthsPeriod.BecomingOverdue,
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
        openFindingsResponse,
      )
      .pipe(
        tap((openFindingsGraphDto) => {
          const openFindingsGraphData =
            FindingGraphsMapperService.mapToOpenFindingsGraphModel(
              openFindingsGraphDto,
            );

          ctx.dispatch(
            new LoadBecomingOverdueFindingsGraphDataSuccess(
              openFindingsGraphData,
            ),
          );
        }),
      );
  }

  @Action(LoadBecomingOverdueFindingsGraphDataSuccess)
  loadBecomingOverdueFindingsGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    {
      becomingOverdueFindingsGraphData,
    }: LoadBecomingOverdueFindingsGraphDataSuccess,
  ) {
    ctx.patchState({ becomingOverdueFindingsGraphData });
  }

  @Action(LoadInProgressFindingsGraphData)
  loadInProgressFindingsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
      openFindingsResponse,
    } = ctx.getState();

    return this.findingGraphsService
      .getOpenFindingsGraphData(
        OpenFindingsMonthsPeriod.InProgress,
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
        openFindingsResponse,
      )
      .pipe(
        tap((openFindingsGraphDto) => {
          const openFindingsGraphData =
            FindingGraphsMapperService.mapToOpenFindingsGraphModel(
              openFindingsGraphDto,
            );

          ctx.dispatch(
            new LoadInProgressFindingsGraphDataSuccess(openFindingsGraphData),
          );
        }),
      );
  }

  @Action(LoadInProgressFindingsGraphDataSuccess)
  loadInProgressFindingsGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { inProgressFindingsGraphData }: LoadInProgressFindingsGraphDataSuccess,
  ) {
    ctx.patchState({ inProgressFindingsGraphData });
  }

  @Action(LoadEarlyStageFindingsGraphData)
  loadEarlyStageFindingsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
      openFindingsResponse,
    } = ctx.getState();

    return this.findingGraphsService
      .getOpenFindingsGraphData(
        OpenFindingsMonthsPeriod.EarlyStage,
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
        openFindingsResponse,
      )
      .pipe(
        tap((openFindingsGraphDto) => {
          const openFindingsGraphData =
            FindingGraphsMapperService.mapToOpenFindingsGraphModel(
              openFindingsGraphDto,
            );

          ctx.dispatch(
            new LoadEarlyStageFindingsGraphDataSuccess(openFindingsGraphData),
          );
        }),
      );
  }

  @Action(LoadEarlyStageFindingsGraphDataSuccess)
  loadEarlyStageFindingsGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { earlyStageFindingsGraphData }: LoadEarlyStageFindingsGraphDataSuccess,
  ) {
    ctx.patchState({ earlyStageFindingsGraphData });
  }

  @Action(ResetOpenFindingsGraphData)
  resetOpenFindingsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    ctx.patchState({
      overdueFindingsGraphData: EMPTY_GRAPH_DATA,
      becomingOverdueFindingsGraphData: EMPTY_GRAPH_DATA,
      inProgressFindingsGraphData: EMPTY_GRAPH_DATA,
      earlyStageFindingsGraphData: EMPTY_GRAPH_DATA,
      openFindingsResponse: OpenFindingsResponse.NoResponse,
    });
  }

  @Action(UpdateOpenFindingsResponse)
  updateOpenFindingsResponse(
    ctx: StateContext<FindingGraphsStateModel>,
    { openFindingsResponse }: UpdateOpenFindingsResponse,
  ) {
    ctx.patchState({ openFindingsResponse });
  }
  // #endregion OpenFindingsGraphs

  // #region FindingTrendsGraphs
  @Action(LoadFindingsTrendsGraphData)
  loadFindingsTrendsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    const { filterCompanies, filterServices, filterSites } = ctx.getState();

    return this.findingGraphsService
      .getFindingsTrendsGraphData(filterCompanies, filterServices, filterSites)
      .pipe(
        tap((findingsByCategoryGraphDto: FindingsTrendsGraphDto) => {
          const findingsByCategoryGraphData =
            FindingGraphsMapperService.mapToFindingsTrendsGraphModel(
              findingsByCategoryGraphDto,
            );

          ctx.dispatch(
            new LoadFindingsTrendsGraphDataSuccess(findingsByCategoryGraphData),
          );
        }),
      );
  }

  @Action(LoadFindingsTrendsGraphDataSuccess)
  loadFindingsByCategoryGraphDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { findingsTrendsGraphData }: LoadFindingsTrendsGraphDataSuccess,
  ) {
    ctx.patchState({
      findingsTrendsGraphData,
    });
  }

  @Action(ResetFindingTrendsGraphData)
  resetFindingTrendsGraphData(ctx: StateContext<FindingGraphsStateModel>) {
    ctx.patchState({
      findingsTrendsGraphData: EMPTY_GRAPH_DATA,
    });
  }

  @Action(LoadFindingsDataTrends)
  loadFindingsDataTrends(ctx: StateContext<FindingGraphsStateModel>) {
    const { filterCompanies, filterServices, filterSites } = ctx.getState();

    return this.findingGraphsService
      .getFindingsTrendsData(filterCompanies, filterServices, filterSites)
      .pipe(
        tap((findingsTrendsData) => {
          const columns = FindingGraphsMapperService.generateColumnsForTrends(
            findingsTrendsData.data,
          );
          const trendsGradient =
            FindingGraphsMapperService.generateGradientMapping(
              findingsTrendsData.data,
            );

          ctx.dispatch(
            new LoadFindingsDataTrendsSuccess(findingsTrendsData.data),
          );
          ctx.dispatch(new CreateFindingsDataTrendsColumns(columns));
          ctx.dispatch(new CreateFindingsDataTrendsGradient(trendsGradient));
        }),
      );
  }

  @Action(LoadFindingsDataTrendsSuccess)
  loadFindingsDataTrendsSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: LoadFindingsDataTrendsSuccess,
  ) {
    ctx.patchState({ findingsTrendsData: data });
  }

  @Action(CreateFindingsDataTrendsColumns)
  createFindingsDataTrendsColumns(
    ctx: StateContext<FindingGraphsStateModel>,
    { columns }: CreateFindingsDataTrendsColumns,
  ) {
    ctx.patchState({ findingsTrendsColumns: columns });
  }

  @Action(CreateFindingsDataTrendsGradient)
  createFindingsDataTrendsGradient(
    ctx: StateContext<FindingGraphsStateModel>,
    { trendsGradient }: CreateFindingsDataTrendsGradient,
  ) {
    ctx.patchState({ findingsTrendsGradient: trendsGradient });
  }

  // #endregion FindingTrendsGraphs

  // #region FindingsByClause

  @Action(LoadFindingsByClauseList)
  loadFindingsByClauseList(ctx: StateContext<FindingGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.findingGraphsService
      .getFindingsByClauseList(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        filter((findingsByClauseListDto) => findingsByClauseListDto?.isSuccess),
        tap((findingsByClauseListDto) => {
          ctx.dispatch(
            new LoadFindingsByClauseListSuccess(findingsByClauseListDto.data),
          );
        }),
      );
  }

  @Action(LoadFindingsByClauseListSuccess)
  loadFindingsByClauseDataSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: LoadFindingsByClauseListSuccess,
  ) {
    ctx.patchState({ findingsByClauseList: data });

    const gradient: { [key: string]: Map<number, string> } = {};

    Object.values(FindingByClauseStatus).forEach((property: string) => {
      gradient[property] = FindingGraphsMapperService.generateGradientMapping(
        data,
        property,
      );
    });

    ctx.dispatch(new CreateFindingsByClauseDataGradient(gradient));
  }

  @Action(CreateFindingsByClauseDataGradient)
  createFindingsByClauseDataGradient(
    ctx: StateContext<FindingGraphsStateModel>,
    { gradient }: CreateFindingsByClauseDataGradient,
  ) {
    ctx.patchState({ findingsByClauseListGradient: gradient });
  }

  // #endregion FindingsByClause

  // #region FindingsBySite

  @Action(LoadFindingsBySiteList)
  LoadFindingsBySiteList(ctx: StateContext<FindingGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.findingGraphsService
      .getFindingsBySiteList(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        filter((findingsBySiteListDto) => findingsBySiteListDto?.isSuccess),
        tap((findingsBySiteListDto) => {
          ctx.dispatch(
            new LoadFindingsBySiteListSuccess(findingsBySiteListDto.data),
          );
        }),
      );
  }

  @Action(LoadFindingsBySiteListSuccess)
  LoadFindingsBySiteListSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: LoadFindingsBySiteListSuccess,
  ) {
    ctx.patchState({ findingsBySiteList: data });
    const gradient: { [key: string]: Map<number, string> } = {};

    Object.values(FindingByClauseStatus).forEach((property: string) => {
      gradient[property] = FindingGraphsMapperService.generateGradientMapping(
        data,
        property,
      );
    });

    ctx.dispatch(new CreateFindingsBySiteListGradient(gradient));
  }

  @Action(CreateFindingsBySiteListGradient)
  CreateFindingsBySiteListGradient(
    ctx: StateContext<FindingGraphsStateModel>,
    { gradient }: CreateFindingsBySiteListGradient,
  ) {
    ctx.patchState({ findingsBySiteListGradient: gradient });
  }

  // #endregion FindingsBySite

  // #region FindingGraphFilters

  @Action(LoadFindingChartFilterList)
  loadFindingChartFilterList(ctx: StateContext<FindingGraphsStateModel>) {
    ctx.dispatch([
      new LoadFindingChartFilterCompanies(),
      new LoadFindingChartFilterServices(),
      new LoadFindingChartFilterSites(),
    ]);
  }

  @Action(LoadFindingChartFilterCompanies)
  loadFindingChartFilterCompanies(ctx: StateContext<FindingGraphsStateModel>) {
    const { filterStartDate, filterEndDate, filterServices, filterSites } =
      ctx.getState();

    return this.getFindingChartFilterCompanies(
      filterStartDate,
      filterEndDate,
      filterServices,
      filterSites,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadFindingChartFilterCompaniesSuccess(
            FindingGraphsMapperService.mapToFindingGraphsFilterCompanies(data),
          ),
        );
      }),
    );
  }

  @Action(LoadFindingChartFilterCompaniesSuccess)
  loadFindingChartFilterCompaniesSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { dataCompanies }: LoadFindingChartFilterCompaniesSuccess,
  ) {
    ctx.patchState({
      dataCompanies,
      filterCompanies: this.getFindingChartFilterPruned(
        dataCompanies,
        ctx.getState().filterCompanies,
      ),
    });
  }

  @Action(LoadFindingChartFilterServices)
  loadFindingChartFilterServices(ctx: StateContext<FindingGraphsStateModel>) {
    const { filterStartDate, filterEndDate, filterCompanies, filterSites } =
      ctx.getState();

    return this.getFindingChartFilterServices(
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterSites,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadFindingChartFilterServicesSuccess(
            FindingGraphsMapperService.mapToFindingGraphsFilterServices(data),
          ),
        );
      }),
    );
  }

  @Action(LoadFindingChartFilterServicesSuccess)
  loadFindingChartFilterServicesSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { dataServices }: LoadFindingChartFilterServicesSuccess,
  ) {
    ctx.patchState({
      dataServices,
      filterServices: this.getFindingChartFilterPruned(
        dataServices,
        ctx.getState().filterServices,
      ),
    });
  }

  @Action(LoadFindingChartFilterSites)
  loadFindingChartFilterSites(ctx: StateContext<FindingGraphsStateModel>) {
    const { filterStartDate, filterEndDate, filterCompanies, filterServices } =
      ctx.getState();

    return this.getFindingChartFilterSites(
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadFindingChartFilterSitesSuccess(
            FindingGraphsMapperService.mapToChartFilterSites(data),
          ),
        );
      }),
    );
  }

  @Action(LoadFindingChartFilterSitesSuccess)
  loadFindingChartFilterSitesSuccess(
    ctx: StateContext<FindingGraphsStateModel>,
    { dataSites }: LoadFindingChartFilterSitesSuccess,
  ) {
    ctx.patchState({ dataSites });
  }

  @Action(UpdateFindingChartFilterByKey)
  updateFindingChartFilterByKey(
    ctx: StateContext<FindingGraphsStateModel>,
    { data, key }: UpdateFindingChartFilterByKey,
  ) {
    const actionsMap = {
      [FindingChartFilterKey.Companies]: [
        new UpdateFindingChartFilterCompanies(data as number[]),
      ],
      [FindingChartFilterKey.Services]: [
        new UpdateFindingChartFilterServices(data as number[]),
      ],
      [FindingChartFilterKey.Sites]: [
        new UpdateFindingChartFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
      [FindingChartFilterKey.TimeRange]: [
        new UpdateFindingChartFilterTimeRange(data as Date[]),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateFindingChartFilterCompanies)
  updateFindingChartFilterCompanies(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: UpdateFindingChartFilterCompanies,
  ) {
    ctx.patchState({
      filterCompanies: data,
    });
    ctx.dispatch([
      new LoadFindingChartFilterServices(),
      new LoadFindingChartFilterSites(),
    ]);
  }

  @Action(UpdateFindingChartFilterServices)
  updateFindingChartFilterServices(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: UpdateFindingChartFilterServices,
  ) {
    ctx.patchState({
      filterServices: data as number[],
    });
    ctx.dispatch([
      new LoadFindingChartFilterCompanies(),
      new LoadFindingChartFilterSites(),
    ]);
  }

  @Action(UpdateFindingChartFilterSites)
  updateFindingChartFilterSites(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: UpdateFindingChartFilterSites,
  ) {
    ctx.patchState({
      filterSites: data.filter as number[],
      prefillSites: structuredClone(data.prefill) as TreeNode[],
    });
    ctx.dispatch([
      new LoadFindingChartFilterCompanies(),
      new LoadFindingChartFilterServices(),
    ]);
  }

  @Action(UpdateFindingChartFilterTimeRange)
  updateFindingChartFilterTimeRange(
    ctx: StateContext<FindingGraphsStateModel>,
    { data }: UpdateFindingChartFilterTimeRange,
  ) {
    ctx.patchState({
      filterStartDate: data[0] as Date,
      filterEndDate: data[1] as Date,
    });
    ctx.dispatch([
      new LoadFindingChartFilterCompanies(),
      new LoadFindingChartFilterServices(),
      new LoadFindingChartFilterSites(),
    ]);
  }

  private getFindingChartFilterCompanies(
    startDate: Date,
    endDate: Date,
    services: number[],
    sites: number[],
  ) {
    return this.findingGraphsService
      .getFindingGraphsFilterCompanies(startDate, endDate, services, sites)
      .pipe(
        map((dto: FindingGraphsFilterCompaniesDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getFindingChartFilterServices(
    startDate: Date,
    endDate: Date,
    companies: number[],
    sites: number[],
  ) {
    return this.findingGraphsService
      .getFindingGraphsFilterServices(startDate, endDate, companies, sites)
      .pipe(
        map((dto: FindingGraphsFilterServicesDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getFindingChartFilterSites(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
  ) {
    return this.findingGraphsService
      .getFindingGraphsFilterSites(startDate, endDate, companies, services)
      .pipe(
        map((dto: FindingGraphsFilterSitesDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getFindingChartFilterPruned(
    data: SharedSelectMultipleDatum<number>[],
    filters: number[],
  ): number[] {
    const values = data.map((d) => d.value);

    return filters.filter((f) => values.includes(f));
  }
  // #endregion FindingGraphFilters
}

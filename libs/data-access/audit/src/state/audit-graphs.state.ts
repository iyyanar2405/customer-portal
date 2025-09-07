import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { map, tap } from 'rxjs';

import {
  BarChartModel,
  DoughnutChartModel,
  DrillDownFilterColumnMapping,
  EMPTY_GRAPH_DATA,
  extractAppliedFilters,
  extractLocationChartFilters,
  FilterValue,
  formatFilter,
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
  shouldApplyFilter,
} from '@customer-portal/shared';

import { AuditChartFilterKey, AuditChartsTabs } from '../constants';
import {
  AuditGraphsFilterCompaniesDto,
  AuditGraphsFilterServicesDto,
  AuditGraphsFilterSitesDto,
} from '../dtos';
import { AuditDaysGridModel } from '../models';
import { AuditGraphsMapperService, AuditGraphsService } from '../services';
import { AuditDaysGridService } from '../services/data-services/audit-days-grid.service';
import { AuditDaysGridMapperService } from '../services/mappers/audit-days-grid-mapper.service';
import {
  LoadAuditChartFilterCompanies,
  LoadAuditChartFilterCompaniesSuccess,
  LoadAuditChartFilterList,
  LoadAuditChartFilterServices,
  LoadAuditChartFilterServicesSuccess,
  LoadAuditChartFilterSites,
  LoadAuditChartFilterSitesSuccess,
  LoadAuditDaysBarGraphData,
  LoadAuditDaysBarGraphDataSuccess,
  LoadAuditDaysDoughnutGraphData,
  LoadAuditDaysDoughnutGraphDataSuccess,
  LoadAuditDaysGridData,
  LoadAuditDaysGridDataSuccess,
  LoadAuditsGraphsData,
  LoadAuditStatusBarGraphData,
  LoadAuditStatusBarGraphDataSuccess,
  LoadAuditStatusDoughnutGraphData,
  LoadAuditStatusDoughnutGraphDataSuccess,
  NavigateFromChartToListView,
  NavigateFromTreeToListView,
  ResetAuditDaysChartData,
  ResetAuditDaysGridData,
  ResetAuditsGraphsData,
  ResetAuditsGraphState,
  ResetAuditStatusChartsData,
  SetActiveAuditsTab,
  SetNavigationGridConfig,
  UpdateAuditChartFilterByKey,
  UpdateAuditChartFilterCompanies,
  UpdateAuditChartFilterServices,
  UpdateAuditChartFilterSites,
  UpdateAuditChartFilterTimeRange,
} from './actions';

export interface AuditGraphsStateModel {
  activeTab: AuditChartsTabs;
  auditStatusDoughnutGraphData: DoughnutChartModel;
  auditStatusBarGraphData: BarChartModel;
  auditDaysDoughnutGraphData: DoughnutChartModel;
  auditDaysBarGraphData: BarChartModel;
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
  auditDaysGridData: AuditDaysGridModel[];
}

const defaultState: AuditGraphsStateModel = {
  activeTab: AuditChartsTabs.AuditStatus,
  auditStatusDoughnutGraphData: EMPTY_GRAPH_DATA,
  auditStatusBarGraphData: EMPTY_GRAPH_DATA,
  auditDaysDoughnutGraphData: EMPTY_GRAPH_DATA,
  auditDaysBarGraphData: EMPTY_GRAPH_DATA,
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
  auditDaysGridData: [],
};

@State<AuditGraphsStateModel>({
  name: 'auditGraphs',
  defaults: defaultState,
})
@Injectable()
export class AuditGraphsState {
  constructor(
    private readonly auditGraphsService: AuditGraphsService,
    private readonly auditDaysGridService: AuditDaysGridService,
  ) {}

  // #region AuditGraphsState
  @Action(ResetAuditsGraphState)
  resetAuditGraphsState(ctx: StateContext<AuditGraphsStateModel>) {
    ctx.setState(defaultState);
  }

  // #endregion AuditGraphsState

  // #region AuditsTabs
  @Action(SetActiveAuditsTab)
  setActiveFindingsTab(
    ctx: StateContext<AuditGraphsStateModel>,
    { activeTab }: SetActiveAuditsTab,
  ) {
    ctx.patchState({ activeTab });
  }

  @Action(ResetAuditsGraphsData)
  resetAuditsGraphsData(ctx: StateContext<AuditGraphsStateModel>) {
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [AuditChartsTabs.AuditStatus]: new ResetAuditDaysChartData(),
      [AuditChartsTabs.AuditDays]: [new ResetAuditStatusChartsData()],
    };

    const actionToDispatch = actionsMap[activeTab];

    if (actionToDispatch) {
      ctx.dispatch(actionToDispatch);
    }
  }

  // #endregion AuditsTabs

  // #region AuditStatusGraphs
  @Action(LoadAuditStatusDoughnutGraphData)
  loadAuditStatusDoughnutGraphData(ctx: StateContext<AuditGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditGraphsService
      .getAuditStatusDoughnutGraphData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditStatusDoughnutGraphDto) => {
          const auditStatusDoughnutGraphData =
            AuditGraphsMapperService.mapToAuditStatusDoughnutGraphModel(
              auditStatusDoughnutGraphDto,
            );

          ctx.dispatch(
            new LoadAuditStatusDoughnutGraphDataSuccess(
              auditStatusDoughnutGraphData,
            ),
          );
        }),
      );
  }

  @Action(LoadAuditStatusDoughnutGraphDataSuccess)
  loadAuditStatusDoughnutGraphDataSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { auditStatusDoughnutGraphData }: LoadAuditStatusDoughnutGraphDataSuccess,
  ) {
    ctx.patchState({ auditStatusDoughnutGraphData });
  }

  @Action(LoadAuditStatusBarGraphData)
  loadAuditStatusBarGraphData(ctx: StateContext<AuditGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditGraphsService
      .getAuditStatusBarGraphData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditStatusBarGraphDto) => {
          const auditStatusBarGraphData =
            AuditGraphsMapperService.mapToAuditStatusBarTypeGraphModel(
              auditStatusBarGraphDto,
            );

          ctx.dispatch(
            new LoadAuditStatusBarGraphDataSuccess(auditStatusBarGraphData),
          );
        }),
      );
  }

  @Action(LoadAuditStatusBarGraphDataSuccess)
  loadAuditStatusBarGraphDataSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { auditStatusBarGraphData }: LoadAuditStatusBarGraphDataSuccess,
  ) {
    ctx.patchState({ auditStatusBarGraphData });
  }

  @Action(ResetAuditStatusChartsData)
  resetAuditStatusChartsData(ctx: StateContext<AuditGraphsStateModel>) {
    ctx.patchState({
      auditStatusDoughnutGraphData: EMPTY_GRAPH_DATA,
      auditStatusBarGraphData: EMPTY_GRAPH_DATA,
    });
  }
  // #endregion AuditStatusGraphs

  // #region AuditDaysGraphs
  @Action(LoadAuditDaysDoughnutGraphData)
  loadAuditDaysDoughnutGraphData(ctx: StateContext<AuditGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditGraphsService
      .getAuditDaysDoughnutGraphData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditDaysDoughnutGraphDto) => {
          const auditDaysDoughnutGraphData =
            AuditGraphsMapperService.mapToAuditDaysDoughnutGraphModel(
              auditDaysDoughnutGraphDto,
            );

          ctx.dispatch(
            new LoadAuditDaysDoughnutGraphDataSuccess(
              auditDaysDoughnutGraphData,
            ),
          );
        }),
      );
  }

  @Action(LoadAuditDaysDoughnutGraphDataSuccess)
  loadAuditDaysDoughnutGraphDataSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { auditDaysDoughnutGraphData }: LoadAuditDaysDoughnutGraphDataSuccess,
  ) {
    ctx.patchState({ auditDaysDoughnutGraphData });
  }

  @Action(LoadAuditDaysBarGraphData)
  loadAuditDaysBarGraphData(ctx: StateContext<AuditGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditGraphsService
      .getAuditDaysBarGraphData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditDaysBarGraphDto) => {
          const auditDaysBarGraphData =
            AuditGraphsMapperService.mapToAuditDaysBarTypeGraphModel(
              auditDaysBarGraphDto,
            );

          ctx.dispatch(
            new LoadAuditDaysBarGraphDataSuccess(auditDaysBarGraphData),
          );
        }),
      );
  }

  @Action(LoadAuditDaysBarGraphDataSuccess)
  loadAuditDaysBarGraphDataSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { auditDaysBarGraphData }: LoadAuditDaysBarGraphDataSuccess,
  ) {
    ctx.patchState({ auditDaysBarGraphData });
  }

  @Action(ResetAuditDaysChartData)
  resetAuditDaysChartsData(ctx: StateContext<AuditGraphsStateModel>) {
    ctx.patchState({
      auditDaysDoughnutGraphData: EMPTY_GRAPH_DATA,
      auditDaysBarGraphData: EMPTY_GRAPH_DATA,
    });
  }
  // #endregion AuditDaysGraphs

  // #region AuditGraphsData
  @Action(LoadAuditsGraphsData)
  loadAuditsGraphsData(ctx: StateContext<AuditGraphsStateModel>) {
    const { activeTab } = ctx.getState();

    const actionsMap = {
      [AuditChartsTabs.AuditStatus]: [
        new LoadAuditStatusDoughnutGraphData(),
        new LoadAuditStatusBarGraphData(),
      ],
      [AuditChartsTabs.AuditDays]: [
        new LoadAuditDaysDoughnutGraphData(),
        new LoadAuditDaysBarGraphData(),
        new LoadAuditDaysGridData(),
      ],
    };

    const actionsToDispatch = actionsMap[activeTab] || [];
    ctx.dispatch(actionsToDispatch);
  }

  @Action(LoadAuditDaysGridData)
  loadAuditDaysGridData(ctx: StateContext<AuditGraphsStateModel>) {
    const {
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
      filterSites,
    } = ctx.getState();

    return this.auditDaysGridService
      .getAuditDaysGridData(
        filterStartDate,
        filterEndDate,
        filterCompanies,
        filterServices,
        filterSites,
      )
      .pipe(
        tap((auditDaysGridDto) => {
          const auditDaysGridData =
            AuditDaysGridMapperService.mapToAuditDaysGridModel(
              auditDaysGridDto,
            );

          ctx.dispatch(new LoadAuditDaysGridDataSuccess(auditDaysGridData));
        }),
      );
  }

  @Action(LoadAuditDaysGridDataSuccess)
  loadAuditDaysGraphDataSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { auditDaysGridData }: LoadAuditDaysGridDataSuccess,
  ) {
    ctx.patchState({ auditDaysGridData });
  }

  @Action(ResetAuditDaysGridData)
  resetAuditDaysGraphData(ctx: StateContext<AuditGraphsStateModel>) {
    ctx.patchState({
      auditDaysGridData: [],
    });
  }

  // #endregion AuditGraphsData

  // #region AuditsGraphsNavigation
  @Action(NavigateFromChartToListView)
  navigateFromChartToListView(
    ctx: StateContext<AuditGraphsStateModel>,
    { tooltipFilters }: NavigateFromChartToListView,
  ) {
    const state = ctx.getState();
    const {
      filterStartDate,
      filterEndDate,
      dataServices,
      filterServices,
      dataCompanies,
      filterCompanies,
      prefillSites,
    } = state;

    const filterColumnMappings: DrillDownFilterColumnMapping = {
      date: 'startDate',
      services: 'service',
      sites: 'site',
      cities: 'city',
      companyName: 'companyName',
    };

    const dateFilters = shouldApplyFilter(
      tooltipFilters,
      filterColumnMappings.date,
    )
      ? formatFilter(
          [filterStartDate, filterEndDate],
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

    const locationFilters = extractLocationChartFilters(prefillSites);

    const citiesFilters = formatFilter(
      locationFilters.cities,
      filterColumnMappings.cities,
    );

    const siteFilters = formatFilter(
      locationFilters.sites,
      filterColumnMappings.sites,
    );

    const companyFilters = extractAppliedFilters(
      dataCompanies,
      filterCompanies,
      filterColumnMappings.companyName,
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
    ctx.dispatch(new Navigate(['/audits']));
  }

  @Action(NavigateFromTreeToListView)
  navigateFromTreeToListView(
    ctx: StateContext<AuditGraphsStateModel>,
    { filterValue }: NavigateFromTreeToListView,
  ) {
    const treeFilter: FilterValue[] = [
      {
        label: filterValue.label,
        value: [
          {
            label: filterValue.value,
            value: filterValue.value,
          },
        ],
      },
    ];

    const state = ctx.getState();
    const { filterStartDate, filterEndDate } = state;

    const filterColumnMappings: Pick<DrillDownFilterColumnMapping, 'date'> = {
      date: 'startDate',
    };

    const dateFilters = formatFilter(
      [filterStartDate, filterEndDate],
      filterColumnMappings.date,
    );

    const updatedFilters = [...treeFilter, ...dateFilters];

    ctx.dispatch(new SetNavigationGridConfig(updatedFilters));
    ctx.dispatch(new Navigate(['/audits']));
  }

  // #endregion AuditsGraphsNavigation

  // #region AuditGraphFilters
  @Action(LoadAuditChartFilterList)
  loadAuditChartFilterList(ctx: StateContext<AuditGraphsStateModel>) {
    ctx.dispatch([
      new LoadAuditChartFilterCompanies(),
      new LoadAuditChartFilterServices(),
      new LoadAuditChartFilterSites(),
    ]);
  }

  @Action(LoadAuditChartFilterCompanies)
  loadAuditChartFilterCompanies(ctx: StateContext<AuditGraphsStateModel>) {
    const { filterStartDate, filterEndDate, filterServices, filterSites } =
      ctx.getState();

    return this.getAuditChartFilterCompanies(
      filterStartDate,
      filterEndDate,
      filterServices,
      filterSites,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadAuditChartFilterCompaniesSuccess(
            AuditGraphsMapperService.mapToAuditGraphsFilterCompanies(data),
          ),
        );
      }),
    );
  }

  @Action(LoadAuditChartFilterCompaniesSuccess)
  loadAuditChartFilterCompaniesSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { dataCompanies }: LoadAuditChartFilterCompaniesSuccess,
  ) {
    ctx.patchState({
      dataCompanies,
      filterCompanies: this.getAuditChartFilterPruned(
        dataCompanies,
        ctx.getState().filterCompanies,
      ),
    });
  }

  @Action(LoadAuditChartFilterServices)
  loadAuditChartFilterServices(ctx: StateContext<AuditGraphsStateModel>) {
    const { filterStartDate, filterEndDate, filterCompanies, filterSites } =
      ctx.getState();

    return this.getAuditChartFilterServices(
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterSites,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadAuditChartFilterServicesSuccess(
            AuditGraphsMapperService.mapToAuditGraphsFilterServices(data),
          ),
        );
      }),
    );
  }

  @Action(LoadAuditChartFilterServicesSuccess)
  loadAuditChartFilterServicesSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { dataServices }: LoadAuditChartFilterServicesSuccess,
  ) {
    ctx.patchState({
      dataServices,
      filterServices: this.getAuditChartFilterPruned(
        dataServices,
        ctx.getState().filterServices,
      ),
    });
  }

  @Action(LoadAuditChartFilterSites)
  loadAuditChartFilterSites(ctx: StateContext<AuditGraphsStateModel>) {
    const { filterStartDate, filterEndDate, filterCompanies, filterServices } =
      ctx.getState();

    return this.getAuditChartFilterSites(
      filterStartDate,
      filterEndDate,
      filterCompanies,
      filterServices,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadAuditChartFilterSitesSuccess(
            AuditGraphsMapperService.mapToChartFilterSites(data),
          ),
        );
      }),
    );
  }

  @Action(LoadAuditChartFilterSitesSuccess)
  loadAuditChartFilterSitesSuccess(
    ctx: StateContext<AuditGraphsStateModel>,
    { dataSites }: LoadAuditChartFilterSitesSuccess,
  ) {
    ctx.patchState({ dataSites });
  }

  @Action(UpdateAuditChartFilterByKey)
  updateAuditChartFilterByKey(
    ctx: StateContext<AuditGraphsStateModel>,
    { data, key }: UpdateAuditChartFilterByKey,
  ) {
    const actionsMap = {
      [AuditChartFilterKey.Companies]: [
        new UpdateAuditChartFilterCompanies(data as number[]),
      ],
      [AuditChartFilterKey.Services]: [
        new UpdateAuditChartFilterServices(data as number[]),
      ],
      [AuditChartFilterKey.Sites]: [
        new UpdateAuditChartFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
      ],
      [AuditChartFilterKey.TimeRange]: [
        new UpdateAuditChartFilterTimeRange(data as Date[]),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateAuditChartFilterCompanies)
  updateAuditChartFilterCompanies(
    ctx: StateContext<AuditGraphsStateModel>,
    { data }: UpdateAuditChartFilterCompanies,
  ) {
    ctx.patchState({
      filterCompanies: data,
    });
    ctx.dispatch([
      new LoadAuditChartFilterServices(),
      new LoadAuditChartFilterSites(),
    ]);
  }

  @Action(UpdateAuditChartFilterServices)
  updateAuditChartFilterServices(
    ctx: StateContext<AuditGraphsStateModel>,
    { data }: UpdateAuditChartFilterServices,
  ) {
    ctx.patchState({
      filterServices: data as number[],
    });
    ctx.dispatch([
      new LoadAuditChartFilterCompanies(),
      new LoadAuditChartFilterSites(),
    ]);
  }

  @Action(UpdateAuditChartFilterSites)
  updateAuditChartFilterSites(
    ctx: StateContext<AuditGraphsStateModel>,
    { data }: UpdateAuditChartFilterSites,
  ) {
    ctx.patchState({
      filterSites: data.filter as number[],
      prefillSites: structuredClone(data.prefill) as TreeNode[],
    });
    ctx.dispatch([
      new LoadAuditChartFilterCompanies(),
      new LoadAuditChartFilterServices(),
    ]);
  }

  @Action(UpdateAuditChartFilterTimeRange)
  updateAuditChartFilterTimeRange(
    ctx: StateContext<AuditGraphsStateModel>,
    { data }: UpdateAuditChartFilterTimeRange,
  ) {
    ctx.patchState({
      filterStartDate: data[0] as Date,
      filterEndDate: data[1] as Date,
    });
    ctx.dispatch([
      new LoadAuditChartFilterCompanies(),
      new LoadAuditChartFilterServices(),
      new LoadAuditChartFilterSites(),
    ]);
  }

  private getAuditChartFilterCompanies(
    startDate: Date,
    endDate: Date,
    services: number[],
    sites: number[],
  ) {
    return this.auditGraphsService
      .getAuditGraphsFilterCompanies(startDate, endDate, services, sites)
      .pipe(
        map((dto: AuditGraphsFilterCompaniesDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getAuditChartFilterServices(
    startDate: Date,
    endDate: Date,
    companies: number[],
    sites: number[],
  ) {
    return this.auditGraphsService
      .getAuditGraphsFilterServices(startDate, endDate, companies, sites)
      .pipe(
        map((dto: AuditGraphsFilterServicesDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getAuditChartFilterSites(
    startDate: Date,
    endDate: Date,
    companies: number[],
    services: number[],
  ) {
    return this.auditGraphsService
      .getAuditGraphsFilterSites(startDate, endDate, companies, services)
      .pipe(
        map((dto: AuditGraphsFilterSitesDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getAuditChartFilterPruned(
    data: SharedSelectMultipleDatum<number>[],
    filters: number[],
  ): number[] {
    const values = data.map((d) => d.value);

    return filters.filter((f) => values.includes(f));
  }

  // #endregion AuditGraphFilters
}

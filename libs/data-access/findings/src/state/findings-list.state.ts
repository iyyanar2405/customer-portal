import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs';

import { NavigateFromOverviewCardToFindingsListView } from '@customer-portal/overview-shared';
import {
  DEFAULT_GRID_CONFIG,
  downloadFileFromByteArray,
  FilterableColumnDefinition,
  FilterOptions,
  getFilterOptions,
  getToastContentBySeverity,
  GridConfig,
  ToastSeverity,
  updateGridConfigBasedOnFilters,
} from '@customer-portal/shared';

import { FindingListItemModel } from '../models';
import { FindingsListMapperService, FindingsListService } from '../services';
import {
  ExportFindingsExcel,
  ExportFindingsExcelFail,
  ExportFindingsExcelSuccess,
  LoadFindingsList,
  LoadFindingsListSuccess,
  ResetFindingsListState,
  SetNavigationGridConfig,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';

export interface FindingsListStateModel {
  findingsItems: FindingListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
}

const defaultState: FindingsListStateModel = {
  findingsItems: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
};

@State<FindingsListStateModel>({
  name: 'findingsList',
  defaults: defaultState,
})
@Injectable()
export class FindingsListState {
  constructor(
    private findingsService: FindingsListService,
    private messageService: MessageService,
    private ts: TranslocoService,
  ) {}

  @Action(LoadFindingsList)
  loadFindingsList(ctx: StateContext<FindingsListStateModel>) {
    return this.findingsService.getFindingList().pipe(
      tap((findingListDto) => {
        const findingsItems =
          FindingsListMapperService.mapToFindingItemModel(findingListDto);

        ctx.dispatch(new LoadFindingsListSuccess(findingsItems));

        ctx.dispatch(new UpdateFilterOptions());
      }),
    );
  }

  @Action(LoadFindingsListSuccess)
  loadFindingsListSuccess(
    ctx: StateContext<FindingsListStateModel>,
    { findingsItems }: LoadFindingsListSuccess,
  ): void {
    ctx.patchState({ findingsItems });
  }

  @Action(UpdateGridConfig, { cancelUncompleted: true })
  updateGridConfig(
    ctx: StateContext<FindingsListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<FindingsListStateModel>): void {
    const { gridConfig, findingsItems } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'findingNumber', hasColumnDelimiter: false },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'title', hasColumnDelimiter: false },
      { field: 'companyName', hasColumnDelimiter: false },
      { field: 'category', hasColumnDelimiter: false },
      { field: 'services', hasColumnDelimiter: true },
      { field: 'site', hasColumnDelimiter: true },
      { field: 'country', hasColumnDelimiter: true },
      { field: 'city', hasColumnDelimiter: true },
      { field: 'openDate', hasColumnDelimiter: false },
      { field: 'findingsId', hasColumnDelimiter: true },
    ];

    const filterOptions = getFilterOptions(
      findingsItems,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ExportFindingsExcel)
  exportFindingsExcel(ctx: StateContext<FindingsListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      FindingsListMapperService.mapToFindingExcelPayloadDto(filterConfig);

    return this.findingsService.exportFindingsExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportFindingsExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportFindingsExcelFail())),
    );
  }

  @Action(ExportFindingsExcelSuccess)
  exportFindingsExcelSuccess(
    _: StateContext<FindingsListStateModel>,
    { input }: ExportFindingsExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'finding.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportFindingsExcelFail)
  exportFindingsExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ResetFindingsListState)
  resetFindingsListState(ctx: StateContext<FindingsListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(SetNavigationGridConfig)
  setNavigationGridConfig(
    ctx: StateContext<FindingsListStateModel>,
    { chartNavigationPayload }: SetNavigationGridConfig,
  ) {
    const { gridConfig } = ctx.getState();

    const updatedGridConfig = updateGridConfigBasedOnFilters(
      gridConfig,
      chartNavigationPayload,
    );

    ctx.patchState({
      gridConfig: updatedGridConfig,
    });
  }

  @Action(NavigateFromOverviewCardToFindingsListView)
  navigateFromOverviewCardToFindingsListView(
    ctx: StateContext<FindingsListStateModel>,
    { overviewCardFilters }: NavigateFromOverviewCardToFindingsListView,
  ) {
    ctx.dispatch(new SetNavigationGridConfig(overviewCardFilters));
  }
}

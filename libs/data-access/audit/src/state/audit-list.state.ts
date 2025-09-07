import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs';

import { NavigateFromOverviewCardToAuditListView } from '@customer-portal/overview-shared';
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

import { AuditListItemModel } from '../models';
import { AuditListMapperService, AuditListService } from '../services';
import {
  ExportAuditsExcel,
  ExportAuditsExcelFail,
  ExportAuditsExcelSuccess,
  LoadAuditList,
  LoadAuditListSuccess,
  ResetAuditListState,
  SetNavigationGridConfig,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';

export interface AuditListStateModel {
  auditItems: AuditListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
}

const defaultState: AuditListStateModel = {
  auditItems: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
};

@State<AuditListStateModel>({
  name: 'auditList',
  defaults: defaultState,
})
@Injectable()
export class AuditListState {
  constructor(
    private auditService: AuditListService,
    private messageService: MessageService,
    private ts: TranslocoService,
  ) {}

  @Action(LoadAuditList)
  loadAuditList(ctx: StateContext<AuditListStateModel>) {
    return this.auditService.getAuditList().pipe(
      tap((auditListDto) => {
        if (!auditListDto?.isSuccess) {
          const message = getToastContentBySeverity(ToastSeverity.Error);
          const entityType = this.ts.translate('audit');
          message.summary = this.ts.translate('error.loading', { entityType });
          this.messageService.add(message);

          return;
        }
        const auditItems =
          AuditListMapperService.mapToAuditItemModel(auditListDto);
        ctx.dispatch(new LoadAuditListSuccess(auditItems));

        ctx.dispatch(new UpdateFilterOptions());
      }),
    );
  }

  @Action(LoadAuditListSuccess)
  loadAuditListSuccess(
    ctx: StateContext<AuditListStateModel>,
    { auditItems }: LoadAuditListSuccess,
  ): void {
    ctx.patchState({ auditItems });
  }

  @Action(UpdateGridConfig, { cancelUncompleted: true })
  updateGridConfig(
    ctx: StateContext<AuditListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ) {
    ctx.patchState({ gridConfig });

    return ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<AuditListStateModel>): void {
    const { gridConfig, auditItems } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'auditNumber', hasColumnDelimiter: false },
      { field: 'status', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: true },
      { field: 'site', hasColumnDelimiter: true },
      { field: 'country', hasColumnDelimiter: true },
      { field: 'city', hasColumnDelimiter: true },
      { field: 'companyName', hasColumnDelimiter: false },
      { field: 'type', hasColumnDelimiter: false },
      { field: 'startDate', hasColumnDelimiter: false },
      { field: 'endDate', hasColumnDelimiter: false },
      { field: 'leadAuthor', hasColumnDelimiter: false },
    ];

    const filterOptions = getFilterOptions(
      auditItems,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ExportAuditsExcel)
  exportAuditsExcel(ctx: StateContext<AuditListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      AuditListMapperService.mapToAuditExcelPayloadDto(filterConfig);

    return this.auditService.exportAuditsExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportAuditsExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportAuditsExcelFail())),
    );
  }

  @Action(ExportAuditsExcelSuccess)
  exportAuditsExcelSuccess(
    _: StateContext<AuditListStateModel>,
    { input }: ExportAuditsExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'audit.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportAuditsExcelFail)
  exportAuditsExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(ResetAuditListState)
  resetAuditListState(ctx: StateContext<AuditListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(SetNavigationGridConfig)
  setNavigationGridConfig(
    ctx: StateContext<AuditListStateModel>,
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

  @Action(NavigateFromOverviewCardToAuditListView)
  navigateFromOverviewCardToAuditListView(
    ctx: StateContext<AuditListStateModel>,
    { overviewCardFilters }: NavigateFromOverviewCardToAuditListView,
  ) {
    ctx.dispatch(new SetNavigationGridConfig(overviewCardFilters));
  }
}

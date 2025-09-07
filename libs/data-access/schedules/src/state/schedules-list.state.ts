import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, filter, tap } from 'rxjs';

import { NavigateFromActionsListToScheduleListView } from '@customer-portal/data-access/actions';
import { NavigateFromNotificationsListToScheduleListView } from '@customer-portal/data-access/notifications';
import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
  SettingsCompanyDetailsStoreService,
} from '@customer-portal/data-access/settings';
import { NavigateFromOverviewCardToScheduleListView } from '@customer-portal/overview-shared';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import {
  DEFAULT_GRID_CONFIG,
  downloadFileFromByteArray,
  FilterableColumnDefinition,
  FilterOptions,
  FilterValue,
  getFilterOptions,
  getToastContentBySeverity,
  GridConfig,
  ToastSeverity,
  updateGridConfigBasedOnFilters,
} from '@customer-portal/shared';

import { ScheduleListItemModel } from '../models';
import { ScheduleListMapperService, ScheduleListService } from '../services';
import {
  ExportSchedulesExcel,
  ExportSchedulesExcelFail,
  ExportSchedulesExcelSuccess,
  LoadScheduleList,
  LoadScheduleListSuccess,
  ResetScheduleListState,
  UpdateFilterOptions,
  UpdateGridConfig,
} from './actions';

export interface ScheduleListStateModel {
  schedules: ScheduleListItemModel[];
  gridConfig: GridConfig;
  filterOptions: FilterOptions;
}

const defaultState: ScheduleListStateModel = {
  schedules: [],
  gridConfig: DEFAULT_GRID_CONFIG,
  filterOptions: {},
};

@State<ScheduleListStateModel>({
  name: 'scheduleList',
  defaults: defaultState,
})
@Injectable()
export class ScheduleListState {
  constructor(
    private messageService: MessageService,
    private scheduleListService: ScheduleListService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private settingsCompanyDetailsStoreService: SettingsCompanyDetailsStoreService,
    private ts: TranslocoService,
  ) {}

  @Action(LoadScheduleList)
  loadScheduleList(ctx: StateContext<ScheduleListStateModel>) {
    return this.scheduleListService.getScheduleList().pipe(
      filter((scheduleListDto) => scheduleListDto.isSuccess),
      tap((scheduleListDto) => {
        const hasScheduleEditPermisssion =
          this.profileStoreService.hasPermission(
            PermissionCategories.Schedule,
            PermissionsList.Edit,
          )();

        const isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser();
        const isAdminUser =
          this.settingsCompanyDetailsStoreService.isUserAdmin();
        const schedules = ScheduleListMapperService.mapToScheduleListItemModel(
          scheduleListDto,
          hasScheduleEditPermisssion,
          isDnvUser,
          isAdminUser,
        );

        if (schedules) {
          ctx.dispatch(new LoadScheduleListSuccess(schedules));
          ctx.dispatch(new UpdateFilterOptions());
        }
      }),
    );
  }

  @Action(LoadScheduleListSuccess)
  loadScheduleListSuccess(
    ctx: StateContext<ScheduleListStateModel>,
    { schedules }: LoadScheduleListSuccess,
  ) {
    ctx.patchState({
      schedules,
    });
  }

  @Action(UpdateGridConfig)
  updateGridConfig(
    ctx: StateContext<ScheduleListStateModel>,
    { gridConfig }: UpdateGridConfig,
  ): void {
    ctx.patchState({ gridConfig });
    ctx.dispatch(new UpdateFilterOptions());
  }

  @Action(UpdateFilterOptions)
  updateFilterOptions(ctx: StateContext<ScheduleListStateModel>): void {
    const { gridConfig, schedules } = ctx.getState();

    const columnFilterConfigs: FilterableColumnDefinition[] = [
      { field: 'status', hasColumnDelimiter: false },
      { field: 'service', hasColumnDelimiter: true },
      { field: 'site', hasColumnDelimiter: false },
      { field: 'city', hasColumnDelimiter: false },
      { field: 'auditType', hasColumnDelimiter: false },
      { field: 'leadAuditor', hasColumnDelimiter: false },
      { field: 'siteRepresentative', hasColumnDelimiter: false },
      { field: 'company', hasColumnDelimiter: false },
      { field: 'startDate', hasColumnDelimiter: false },
      { field: 'endDate', hasColumnDelimiter: false },
      { field: 'siteAuditId', hasColumnDelimiter: true },
    ];

    const filterOptions = getFilterOptions(
      schedules,
      gridConfig,
      columnFilterConfigs,
    );

    ctx.patchState({ filterOptions });
  }

  @Action(ResetScheduleListState)
  resetScheduleListState(ctx: StateContext<ScheduleListStateModel>) {
    ctx.setState(defaultState);
  }

  @Action(ExportSchedulesExcel)
  exportSchedulesExcel(ctx: StateContext<ScheduleListStateModel>) {
    const filterConfig = { ...ctx.getState().gridConfig.filtering };
    const payload =
      ScheduleListMapperService.mapToScheduleExcelPayloadDto(filterConfig);

    return this.scheduleListService.exportSchedulesExcel(payload).pipe(
      tap((result) => ctx.dispatch(new ExportSchedulesExcelSuccess(result))),
      catchError(() => ctx.dispatch(new ExportSchedulesExcelFail())),
    );
  }

  @Action(ExportSchedulesExcelSuccess)
  exportSchedulesExcelSuccess(
    _: StateContext<ScheduleListStateModel>,
    { input }: ExportSchedulesExcelSuccess,
  ) {
    downloadFileFromByteArray(
      input,
      'schedule.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.DownloadSuccess),
    );
  }

  @Action(ExportSchedulesExcelFail)
  exportSchedulesExcelFail() {
    this.messageService.add(
      getToastContentBySeverity(ToastSeverity.ExportFail),
    );
  }

  @Action(NavigateFromOverviewCardToScheduleListView)
  navigateFromOverviewCardToAuditListView(
    ctx: StateContext<ScheduleListStateModel>,
    { overviewCardFilters }: NavigateFromOverviewCardToScheduleListView,
  ) {
    const { gridConfig } = ctx.getState();

    const updatedGridConfig = updateGridConfigBasedOnFilters(
      gridConfig,
      overviewCardFilters,
    );

    ctx.patchState({
      gridConfig: updatedGridConfig,
    });
  }

  @Action(NavigateFromNotificationsListToScheduleListView)
  navigateFromNotificationsToScheduleListView(
    ctx: StateContext<ScheduleListStateModel>,
    { notificationsFilters }: NavigateFromNotificationsListToScheduleListView,
  ) {
    this.updateGridConfigWithNavigationFilters(ctx, notificationsFilters);
  }

  @Action(NavigateFromActionsListToScheduleListView)
  navigateFromActionsToScheduleListView(
    ctx: StateContext<ScheduleListStateModel>,
    { notificationsFilters }: NavigateFromActionsListToScheduleListView,
  ) {
    this.updateGridConfigWithNavigationFilters(ctx, notificationsFilters);
  }

  private updateGridConfigWithNavigationFilters(
    ctx: StateContext<ScheduleListStateModel>,
    notificationsFilters: FilterValue[],
  ): void {
    const { gridConfig } = ctx.getState();

    const updatedGridConfig = updateGridConfigBasedOnFilters(
      gridConfig,
      notificationsFilters,
    );

    ctx.patchState({
      gridConfig: updatedGridConfig,
    });
  }
}

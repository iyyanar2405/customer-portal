import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { combineLatest, switchMap, tap } from 'rxjs';

import {
  ProfileStoreService,
  SettingsCoBrowsingStoreService,
} from '@customer-portal/data-access/settings';
import {
  PermissionCategories,
  PermissionsList,
} from '@customer-portal/permissions';
import { RouteStoreService } from '@customer-portal/router';
import {
  COLUMN_DELIMITER,
  DEFAULT_GRID_CONFIG,
  downloadFileFromByteArray,
  FilterOptions,
  getFilterOptionsForColumn,
  getToastContentBySeverity,
  GridConfig,
  ToastSeverity,
} from '@customer-portal/shared';

import {
  AuditDetailsModel,
  AuditDocumentListItemModel,
  AuditFindingListItemModel,
  AuditSiteListItemModel,
  SubAuditListItemModel,
} from '../models';
import {
  AuditDetailsMapperService,
  AuditDetailsService,
  AuditDocumentsListService,
} from '../services';
import {
  ExportAuditFindingsExcel,
  ExportSubAuditExcelSuccess,
  ExportSubAuditsExcel,
  LoadAuditDetails,
  LoadAuditDetailsSuccess,
  LoadAuditDocumentsList,
  LoadAuditDocumentsListSuccess,
  LoadAuditFindingsList,
  LoadAuditFindingsListSuccess,
  LoadAuditSitesList,
  LoadAuditSitesListSuccess,
  LoadSubAuditList,
  LoadSubAuditListSuccess,
  ResetAuditDetailsState,
  UpdateAuditDocumentsListFilterOptions,
  UpdateAuditDocumentsListGridConfig,
  UpdateAuditFindingListFilterOptions,
  UpdateAuditFindingListGridConfig,
  UpdateAuditSitesListFilterOptions,
  UpdateAuditSitesListGridConfig,
  UpdateSubAuditListFilterOptions,
  UpdateSubAuditListGridConfig,
} from './actions';

export interface AuditDetailsStateModel {
  auditDetails: AuditDetailsModel;
  auditId: string;
  subAuditItems: SubAuditListItemModel[];
  subAuditGridConfig: GridConfig;
  subAuditFilterOptions: FilterOptions;
  auditFindingItems: AuditFindingListItemModel[];
  auditFindingGridConfig: GridConfig;
  auditFindingFilterOptions: FilterOptions;
  siteItems: AuditSiteListItemModel[];
  siteItemsGridConfig: GridConfig;
  siteItemsFilterOptions: FilterOptions;
  auditDocumentsList: AuditDocumentListItemModel[];
  auditDocumentsGridConfig: GridConfig;
  auditDocumentsFilterOptions: FilterOptions;
}

const defaultState: AuditDetailsStateModel = {
  auditId: '',
  auditDetails: {
    auditNumber: 0,
    header: {
      status: '',
      services: '',
      siteName: '',
      siteAddress: '',
      startDate: '',
      endDate: '',
      auditor: '',
      auditorTeam: [],
      auditPlanDocId: [],
      auditReportDocId: [],
    },
  },
  subAuditGridConfig: DEFAULT_GRID_CONFIG,
  subAuditFilterOptions: {},
  auditFindingItems: [],
  auditFindingGridConfig: DEFAULT_GRID_CONFIG,
  auditFindingFilterOptions: {},
  subAuditItems: [],
  siteItems: [],
  siteItemsGridConfig: DEFAULT_GRID_CONFIG,
  siteItemsFilterOptions: {},
  auditDocumentsList: [],
  auditDocumentsGridConfig: DEFAULT_GRID_CONFIG,
  auditDocumentsFilterOptions: {},
};

@State<AuditDetailsStateModel>({
  name: 'auditDetails',
  defaults: defaultState,
})
@Injectable()
export class AuditDetailsState {
  constructor(
    private auditDetailsService: AuditDetailsService,
    private routeStoreService: RouteStoreService,
    private auditDocumentsListService: AuditDocumentsListService,
    private profileStoreService: ProfileStoreService,
    private settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private messageService: MessageService,
  ) {}

  // #region AuditDetails
  @Action(LoadAuditDetails)
  loadAuditDetails(ctx: StateContext<AuditDetailsStateModel>) {
    return this.routeStoreService.getPathParamByKey('auditId').pipe(
      switchMap((auditId) =>
        combineLatest([
          this.auditDetailsService.getAuditDetails(Number(auditId)),
          this.auditDocumentsListService.getAuditDocumentsList(auditId, true),
        ]).pipe(
          tap(([auditDetailsDto, auditDocumentsListDto]) => {
            const auditDetails =
              AuditDetailsMapperService.mapToAuditDetailsModel(
                auditDetailsDto,
                auditDocumentsListDto,
              );

            if (auditDetails) {
              ctx.dispatch(new LoadAuditDetailsSuccess(auditDetails, auditId));
            }
          }),
        ),
      ),
    );
  }

  @Action(LoadAuditDetailsSuccess)
  loadAuditDetailsSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDetails, auditId }: LoadAuditDetailsSuccess,
  ): void {
    ctx.patchState({ auditDetails, auditId });
  }

  @Action(ResetAuditDetailsState)
  resetAuditDetailsState(ctx: StateContext<AuditDetailsStateModel>) {
    ctx.setState(defaultState);
  }

  // #endregion AuditDetails

  // #region AuditFindingList
  @Action(LoadAuditFindingsList)
  loadAuditFindingsList(ctx: StateContext<AuditDetailsStateModel>) {
    return this.routeStoreService.getPathParamByKey('auditId').pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getAuditFindingList(Number(auditId)).pipe(
          tap((auditFindingListDto) => {
            const findingsItems =
              AuditDetailsMapperService.mapToAuditFindingListItemModel(
                auditFindingListDto,
              );

            ctx.dispatch(new LoadAuditFindingsListSuccess(findingsItems));

            ctx.dispatch(
              new UpdateAuditFindingListFilterOptions(findingsItems),
            );
          }),
        ),
      ),
    );
  }

  @Action(LoadAuditFindingsListSuccess)
  loadFindingsListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditFindingItems }: LoadAuditFindingsListSuccess,
  ): void {
    ctx.patchState({ auditFindingItems });
  }

  @Action(UpdateAuditFindingListFilterOptions)
  updateAuditFindingListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditFindingItems }: UpdateAuditFindingListFilterOptions,
  ): void {
    const auditFindingFilterOptions = {
      findingNumber: getFilterOptionsForColumn(
        auditFindingItems,
        'findingNumber',
      ),
      status: getFilterOptionsForColumn(auditFindingItems, 'status'),
      title: getFilterOptionsForColumn(auditFindingItems, 'title'),
      category: getFilterOptionsForColumn(auditFindingItems, 'category'),
      companyName: getFilterOptionsForColumn(auditFindingItems, 'companyName'),
      services: getFilterOptionsForColumn(
        auditFindingItems,
        'services',
        COLUMN_DELIMITER,
      ),
      site: getFilterOptionsForColumn(
        auditFindingItems,
        'site',
        COLUMN_DELIMITER,
      ),
      city: getFilterOptionsForColumn(
        auditFindingItems,
        'city',
        COLUMN_DELIMITER,
      ),
      auditNumber: getFilterOptionsForColumn(auditFindingItems, 'auditNumber'),
    };

    ctx.patchState({ auditFindingFilterOptions });
  }

  @Action(UpdateAuditFindingListGridConfig)
  updateAuditFindingListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditFindingGridConfig }: UpdateAuditFindingListGridConfig,
  ): void {
    ctx.patchState({ auditFindingGridConfig });
  }

  @Action(ExportAuditFindingsExcel)
  exportAuditFindingsExcel(ctx: StateContext<AuditDetailsStateModel>) {
    const filterConfig = {
      ...ctx.getState().auditFindingGridConfig.filtering,
    };
    const { auditId } = ctx.getState();
    const payload = AuditDetailsMapperService.mapToAuditFindingsExcelPayloadDto(
      filterConfig,
      auditId,
    );

    return this.auditDetailsService
      .exportAuditFindingsExcel(payload)
      .pipe(
        tap((result) =>
          downloadFileFromByteArray(
            result,
            'auditFindings.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ),
        ),
      );
  }

  // #endregion AuditFindingList

  // #region SubAuditList
  @Action(LoadSubAuditList)
  loadSubAuditList(ctx: StateContext<AuditDetailsStateModel>) {
    return combineLatest([
      this.routeStoreService.getPathParamByKey('auditId'),
    ]).pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getSubAuditList(+auditId).pipe(
          tap((subAuditListDto) => {
            const subAuditItems =
              AuditDetailsMapperService.mapToSubAuditItemModel(subAuditListDto);

            ctx.dispatch(new LoadSubAuditListSuccess(subAuditItems));

            ctx.dispatch(new UpdateSubAuditListFilterOptions(subAuditItems));
          }),
        ),
      ),
    );
  }

  @Action(LoadSubAuditListSuccess)
  loadSubAuditListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { subAuditItems }: LoadSubAuditListSuccess,
  ): void {
    ctx.patchState({ subAuditItems });
  }

  @Action(UpdateSubAuditListFilterOptions)
  updateSubAuditListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { subAuditItems }: UpdateSubAuditListFilterOptions,
  ): void {
    const subAuditFilterOptions = {
      auditNumber: getFilterOptionsForColumn(subAuditItems, 'auditNumber'),
      status: getFilterOptionsForColumn(subAuditItems, 'status'),
      service: getFilterOptionsForColumn(
        subAuditItems,
        'service',
        COLUMN_DELIMITER,
      ),
      site: getFilterOptionsForColumn(subAuditItems, 'site'),
      city: getFilterOptionsForColumn(subAuditItems, 'city', COLUMN_DELIMITER),
      auditorTeam: getFilterOptionsForColumn(
        subAuditItems,
        'auditorTeam',
        COLUMN_DELIMITER,
      ),
    };

    ctx.patchState({ subAuditFilterOptions });
  }

  @Action(UpdateSubAuditListGridConfig)
  updateSubAuditFindingListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    { subAuditGridConfig }: UpdateSubAuditListGridConfig,
  ): void {
    ctx.patchState({ subAuditGridConfig });
  }

  @Action(ExportSubAuditsExcel)
  ExportSubAuditsExcel(ctx: StateContext<AuditDetailsStateModel>) {
    const filterConfig = { ...ctx.getState().subAuditGridConfig.filtering };
    const { auditId } = ctx.getState();
    const payload = AuditDetailsMapperService.mapToSubAuditExcelPayloadDto(
      +auditId,
      filterConfig,
    );

    return this.auditDetailsService.exportSubAuditsExcel(payload).pipe(
      tap({
        next: (result) => {
          ctx.dispatch(new ExportSubAuditExcelSuccess(result));
          downloadFileFromByteArray(
            result,
            'subaudit.xlsx',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          );
          this.messageService.add(
            getToastContentBySeverity(ToastSeverity.Success),
          );
        },
      }),
    );
  }

  // #endregion SubAuditList

  // #region SitesList
  @Action(LoadAuditSitesList)
  loadSitesList(ctx: StateContext<AuditDetailsStateModel>) {
    return combineLatest([
      this.routeStoreService.getPathParamByKey('auditId'),
    ]).pipe(
      switchMap((auditId) =>
        this.auditDetailsService.getSitesList(+auditId).pipe(
          tap((sitesListDto) => {
            const siteItems =
              AuditDetailsMapperService.mapToAuditSitesItemModel(sitesListDto);

            ctx.dispatch(new LoadAuditSitesListSuccess(siteItems));

            ctx.dispatch(new UpdateAuditSitesListFilterOptions(siteItems));
          }),
        ),
      ),
    );
  }

  @Action(LoadAuditSitesListSuccess)
  loadSitesListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditSiteItems: siteItems }: LoadAuditSitesListSuccess,
  ): void {
    ctx.patchState({ siteItems });
  }

  @Action(UpdateAuditSitesListFilterOptions)
  updateSitesListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditSiteItems: siteItems }: UpdateAuditSitesListFilterOptions,
  ): void {
    const siteItemsFilterOptions = {
      siteName: getFilterOptionsForColumn(siteItems, 'siteName'),
      siteAddress: getFilterOptionsForColumn(siteItems, 'siteAddress'),
      city: getFilterOptionsForColumn(siteItems, 'city'),
      country: getFilterOptionsForColumn(siteItems, 'country'),
      postcode: getFilterOptionsForColumn(siteItems, 'postcode'),
    };

    ctx.patchState({ siteItemsFilterOptions });
  }

  @Action(UpdateAuditSitesListGridConfig)
  updateSitesListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    {
      auditSiteItemsGridConfig: siteItemsGridConfig,
    }: UpdateAuditSitesListGridConfig,
  ): void {
    ctx.patchState({ siteItemsGridConfig });
  }

  // #endregion SitesList

  // #region AuditDocumentsList
  @Action(LoadAuditDocumentsList)
  loadAuditDocumentsList(ctx: StateContext<AuditDetailsStateModel>) {
    return this.routeStoreService.getPathParamByKey('auditId').pipe(
      switchMap((auditId) =>
        this.auditDocumentsListService
          .getAuditDocumentsList(auditId, false)
          .pipe(
            tap((sitesListDto) => {
              const hasAuditsEditPermission =
                this.profileStoreService.hasPermission(
                  PermissionCategories.Audits,
                  PermissionsList.Edit,
                )();

              const isDnvUser = this.settingsCoBrowsingStoreService.isDnvUser();

              const auditDocumentsList =
                AuditDetailsMapperService.mapToAuditDocumentItemModel(
                  sitesListDto,
                  hasAuditsEditPermission,
                  isDnvUser,
                );

              ctx.dispatch(
                new LoadAuditDocumentsListSuccess(auditDocumentsList),
              );

              ctx.dispatch(
                new UpdateAuditDocumentsListFilterOptions(auditDocumentsList),
              );
            }),
          ),
      ),
    );
  }

  @Action(LoadAuditDocumentsListSuccess)
  loadAuditDocumentsListSuccess(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDocumentsList }: LoadAuditDocumentsListSuccess,
  ): void {
    ctx.patchState({ auditDocumentsList });
  }

  @Action(UpdateAuditDocumentsListFilterOptions)
  updateAuditDocumentsListFilterOptions(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDocumentsList }: UpdateAuditDocumentsListFilterOptions,
  ): void {
    const auditDocumentsFilterOptions = {
      fileType: getFilterOptionsForColumn(auditDocumentsList, 'fileType'),
      uploadedBy: getFilterOptionsForColumn(auditDocumentsList, 'uploadedBy'),
      fileName: getFilterOptionsForColumn(auditDocumentsList, 'fileName'),
    };

    ctx.patchState({ auditDocumentsFilterOptions });
  }

  @Action(UpdateAuditDocumentsListGridConfig)
  updateAuditDocumentsListGridConfig(
    ctx: StateContext<AuditDetailsStateModel>,
    { auditDocumentsGridConfig }: UpdateAuditDocumentsListGridConfig,
  ): void {
    ctx.patchState({ auditDocumentsGridConfig });
  }

  // #endregion AuditDocumentsList
}

import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, take } from 'rxjs';

import { LoggingService, ServiceNowService } from '@customer-portal/core';
import {
  NotificationListStoreService,
  NotificationModel,
} from '@customer-portal/data-access/notifications';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  FINDINGS_STATUS_STATES_MAP,
  getToastContentBySeverity,
  GridComponent,
  GridConfig,
  GridRowAction,
  HelpClickedModal,
  HtmlDetailsFooterModalComponent,
  HtmlDetailsModalComponent,
  modalBreakpoints,
  NOTIFICATION_HELP_SUPPORT,
  ToastSeverity,
} from '@customer-portal/shared';

import { notificationsList } from '../../__mocks__';
import { NOTIFICATION_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-notification-list',
  imports: [GridComponent, ButtonModule],
  providers: [NotificationListStoreService],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent
  extends BasePreferencesComponent
  implements OnInit
{
  cols: ColumnDefinition[] = NOTIFICATION_LIST_COLUMNS;
  notificationsList = notificationsList;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  public list?: Observable<GridRowAction>;

  constructor(
    public notificationListStoreService: NotificationListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
    private ts: TranslocoService,
    private serviceNowService: ServiceNowService,
    private messageService: MessageService,
    private loggingService: LoggingService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationListStoreService.loadNotificationList();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.notificationListStoreService.updateGridConfig(gridConfig);
  }

  onNotificationRowClick(inputData: { rowData: GridRowAction }): void {
    if (this.settingsCoBrowsingStoreService.isDnvUser()) {
      return;
    }

    const { id, entityId, entityType } = inputData.rowData as NotificationModel;

    const dialogRef = this.dialogService.open(HtmlDetailsModalComponent, {
      header: inputData.rowData.title,
      modal: true,
      width: '600px',
      breakpoints: modalBreakpoints,
      data: { message: inputData.rowData.message },
      templates: {
        footer: HtmlDetailsFooterModalComponent,
      },
    });
    dialogRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result) {
        if (this.isHelpAction(result)) {
          this.openHelpServiceNowSupport();
        } else {
          this.notificationListStoreService.markNotificationAsRead(id);
          this.notificationListStoreService.navigateFromNotification(
            entityId,
            entityType,
          );
        }
      }
    });
  }

  private isHelpAction(value: HelpClickedModal | boolean): boolean {
    if (typeof value === 'boolean') {
      return false;
    }

    return value.action === NOTIFICATION_HELP_SUPPORT.NotificationHelp;
  }

  private openHelpServiceNowSupport(): void {
    try {
      this.serviceNowService.openCatalogItemSupport();
    } catch (error) {
      const message = getToastContentBySeverity(ToastSeverity.Error);
      message.summary = this.ts.translate('serviceNow.error');
      this.messageService.add(message);
      this.loggingService.logException(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}

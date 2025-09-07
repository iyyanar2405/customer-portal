import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, tap } from 'rxjs';

import { ActionsListStoreService } from '@customer-portal/data-access/actions';
import { NotificationModel as ActionModel } from '@customer-portal/data-access/notifications';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  FINDINGS_STATUS_STATES_MAP,
  GridComponent,
  GridConfig,
  GridRowAction,
  HtmlDetailsFooterModalComponent,
  HtmlDetailsModalComponent,
  modalBreakpoints,
} from '@customer-portal/shared';

import { ACTIONS_LIST_COLUMNS } from '../../constants/actions-list-column-constant';

@Component({
  selector: 'lib-actions-list',
  imports: [
    CommonModule,
    TranslocoDirective,
    GridComponent,
    CheckboxModule,
    FormsModule,
  ],
  providers: [ActionsListStoreService, DialogService],
  templateUrl: './actions-list.component.html',
  styleUrl: './actions-list.component.scss',
})
export class ActionsListComponent
  extends BasePreferencesComponent
  implements OnInit
{
  cols: ColumnDefinition[] = ACTIONS_LIST_COLUMNS;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  isChecked = false;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.actionsListStoreService.loadActionsDetails();
    }),
  );

  constructor(
    public actionsListStoreService: ActionsListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
    private dialogService: DialogService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionsListStoreService.loadActionsDetails();
  }

  onActionRowClick(inputData: { rowData: GridRowAction }): void {
    if (this.settingsCoBrowsingStoreService.isDnvUser()) {
      return;
    }

    const { entityId, entityType } = inputData.rowData as ActionModel;

    const dialogRef = this.dialogService.open(HtmlDetailsModalComponent, {
      header: inputData.rowData.actionName,
      modal: true,
      width: '600px',
      breakpoints: modalBreakpoints,
      data: { message: inputData.rowData.message },
      templates: {
        footer: HtmlDetailsFooterModalComponent,
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.actionsListStoreService.navigateFromAction(entityId, entityType);
      }
    });
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.actionsListStoreService.updateGridConfig(gridConfig);
  }

  onChangeHighPriority(event: CheckboxChangeEvent): void {
    this.actionsListStoreService.loadHighPriorityAction(event.checked);
  }
}

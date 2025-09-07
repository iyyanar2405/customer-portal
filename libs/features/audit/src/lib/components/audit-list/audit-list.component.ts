import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { filter, tap } from 'rxjs';

import { AuditListStoreService } from '@customer-portal/data-access/audit';
import { SettingsCoBrowsingStoreService } from '@customer-portal/data-access/settings';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  ColumnDefinition,
  GridComponent,
  GridConfig,
  ObjectName,
  ObjectType,
  PageName,
  STATUS_STATES_MAP,
} from '@customer-portal/shared';

import { AUDIT_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-list',
  imports: [CommonModule, GridComponent],
  providers: [AuditListStoreService],
  templateUrl: './audit-list.component.html',
  styleUrl: './audit-list.component.scss',
})
export class AuditListComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  statusStatesMap = STATUS_STATES_MAP;

  cols: ColumnDefinition[] = AUDIT_LIST_COLUMNS;

  isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.auditListStoreService.loadAuditList();
    }),
  );

  constructor(
    public auditListStoreService: AuditListStoreService,
    public settingsCoBrowsingStoreService: SettingsCoBrowsingStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.AuditList,
      ObjectName.Audits,
      ObjectType.Grid,
    );
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditListStoreService.updateGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    this.auditListStoreService.exportAuditsExcel();
  }

  onSavePreference(data: any): void {
    this.savePreferences(data);
  }

  ngOnDestroy(): void {
    this.auditListStoreService.resetAuditListState();
  }
}

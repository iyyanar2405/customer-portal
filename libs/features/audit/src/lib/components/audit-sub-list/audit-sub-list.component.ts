import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuditDetailsStoreService } from '@customer-portal/data-access/audit';
import {
  ColumnDefinition,
  GridComponent,
  GridConfig,
  STATUS_STATES_MAP,
} from '@customer-portal/shared';

import { SUB_AUDIT_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-sub-list',
  imports: [CommonModule, GridComponent, TranslocoDirective],
  providers: [],
  templateUrl: './audit-sub-list.component.html',
  styleUrl: './audit-sub-list.component.scss',
})
export class AuditSubListComponent {
  statusStatesMap = STATUS_STATES_MAP;
  cols: ColumnDefinition[] = SUB_AUDIT_LIST_COLUMNS;

  constructor(public auditDetailsStoreService: AuditDetailsStoreService) {
    this.auditDetailsStoreService.loadSubAuditList();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateSubAuditGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    this.auditDetailsStoreService.exportSubAuditsExcel();
  }
}

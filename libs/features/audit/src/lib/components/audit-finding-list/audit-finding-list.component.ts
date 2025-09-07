import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { AuditDetailsStoreService } from '@customer-portal/data-access/audit';
import {
  ColumnDefinition,
  FINDINGS_STATUS_STATES_MAP,
  FINDINGS_TAG_STATES_MAP,
  GridComponent,
  GridConfig,
} from '@customer-portal/shared';

import { AUDIT_FINDING_LIST_COLUMNS } from '../../constants';

@Component({
  selector: 'lib-audit-finding-list',
  imports: [CommonModule, GridComponent, TranslocoDirective],
  providers: [],
  templateUrl: './audit-finding-list.component.html',
  styleUrl: './audit-finding-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditFindingListComponent {
  tagStatesMap = FINDINGS_TAG_STATES_MAP;
  statusStatesMap = FINDINGS_STATUS_STATES_MAP;
  cols: ColumnDefinition[] = AUDIT_FINDING_LIST_COLUMNS;

  constructor(public auditDetailsStoreService: AuditDetailsStoreService) {
    this.auditDetailsStoreService.loadAuditFindingsList();
  }

  onGridConfigChanged(gridConfig: GridConfig): void {
    this.auditDetailsStoreService.updateAuditFindingListGridConfig(gridConfig);
  }

  onExportExcelClick(): void {
    this.auditDetailsStoreService.exportAuditFindingsExcel();
  }
}

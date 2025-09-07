import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  AuditChartsStoreService,
  AuditDaysNode,
} from '@customer-portal/data-access/audit';
import {
  IndividualFilter,
  TreeColumnDefinition,
  TreeTableComponent,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-audit-days-grid',
  imports: [CommonModule, TranslocoDirective, TreeTableComponent],
  templateUrl: './audit-days-grid.component.html',
  styleUrl: './audit-days-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditDaysGridComponent implements OnInit, OnDestroy {
  graphColumns: TreeColumnDefinition[] = [
    {
      field: 'location',
      header: 'location',
      isTranslatable: true,
      hasNavigationEnabled: true,
      width: '80%',
    },
    {
      field: 'auditDays',
      header: this._ts.translate(
        'audit.auditGraphs.auditDays.bySite.auditDays',
      ),
      isTranslatable: false,
      width: '20%',
    },
  ];

  constructor(
    public auditChartsStoreService: AuditChartsStoreService,
    private _ts: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.auditChartsStoreService.loadAuditsGraphsData();
  }

  onRowClicked(rowData: AuditDaysNode): void {
    const filterValue: IndividualFilter = {
      label: rowData.dataType,
      value: rowData.location,
    };
    this.auditChartsStoreService.navigateFromTreeToListView(filterValue);
  }

  ngOnDestroy(): void {
    this.auditChartsStoreService.resetAuditsGraphsData();
  }
}

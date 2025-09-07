import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TabViewChangeEvent, TabViewModule } from 'primeng/tabview';

import {
  AuditChartsStoreService,
  AuditChartsTabs,
} from '@customer-portal/data-access/audit';

import { AuditDaysChartsComponent } from '../audit-days-charts';
import { AuditStatusChartsComponent } from '../audit-status-charts';

@Component({
  selector: 'lib-audit-charts-tab-view',
  imports: [
    CommonModule,
    TabViewModule,
    TranslocoDirective,
    AuditStatusChartsComponent,
    AuditDaysChartsComponent,
  ],
  templateUrl: './audit-charts-tab-view.component.html',
  styleUrl: './audit-charts-tab-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditChartsTabViewComponent {
  private readonly tabsMapping: AuditChartsTabs[] = [
    AuditChartsTabs.AuditStatus,
    AuditChartsTabs.AuditDays,
  ];

  @Output() tabChange = new EventEmitter<boolean>();

  readonly AuditChartsTabs = AuditChartsTabs;
  activeTab = AuditChartsTabs.AuditStatus;

  constructor(private auditChartsStoreService: AuditChartsStoreService) {}

  onTabChange(event: TabViewChangeEvent): void {
    this.activeTab = this.tabsMapping[event.index];
    this.auditChartsStoreService.setActiveAuditsTab(this.activeTab);

    this.tabChange.emit(this.activeTab === AuditChartsTabs.AuditDays);
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  AuditChartFilterKey,
  AuditChartFilterStoreService,
  AuditChartsStoreService,
} from '@customer-portal/data-access/audit';
import {
  getTimeRange,
  SharedSelectDateRangeComponent,
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
  TimeRange,
} from '@customer-portal/shared';

import { AuditChartsTabViewComponent } from '../audit-charts-tab-view';

@Component({
  selector: 'lib-audit-charts',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectDateRangeComponent,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
    AuditChartsTabViewComponent,
  ],
  providers: [AuditChartFilterStoreService, AuditChartsStoreService],
  templateUrl: './audit-charts.component.html',
  styleUrl: './audit-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditChartsComponent implements OnInit, OnDestroy {
  private lastTimeRangeValue: Date[] = [];

  selectedTimeRange = signal(TimeRange.YearCurrent);
  chartFilterType = AuditChartFilterKey;
  dateRangeIsDisabled = false;

  constructor(
    public readonly auditChartFilterStoreService: AuditChartFilterStoreService,
    public readonly auditChartsStoreService: AuditChartsStoreService,
  ) {}

  ngOnInit(): void {
    this.loadGraphsFilterList();
  }

  onFilterChange(data: unknown, key: AuditChartFilterKey): void {
    this.auditChartFilterStoreService.updateAuditChartFilterByKey(data, key);
    this.auditChartsStoreService.loadAuditsGraphsData();
  }

  onTabChange(isAuditDaysTab: boolean): void {
    this.dateRangeIsDisabled = isAuditDaysTab;

    if (!isAuditDaysTab && this.lastTimeRangeValue.length) {
      this.auditChartFilterStoreService.updateAuditChartFilterByKey(
        this.lastTimeRangeValue,
        AuditChartFilterKey.TimeRange,
      );
    }

    if (isAuditDaysTab) {
      this.lastTimeRangeValue =
        this.auditChartFilterStoreService.filterDateRange();
      this.auditChartFilterStoreService.updateAuditChartFilterByKey(
        getTimeRange(TimeRange.YearCurrent),
        AuditChartFilterKey.TimeRange,
      );
      this.selectedTimeRange.set(TimeRange.YearCurrent);
    } else {
      this.lastTimeRangeValue = [];
    }
  }

  ngOnDestroy(): void {
    this.auditChartsStoreService.resetAuditsGraphState();
  }

  private loadGraphsFilterList(): void {
    this.auditChartFilterStoreService.updateAuditChartFilterByKey(
      getTimeRange(TimeRange.YearCurrent),
      AuditChartFilterKey.TimeRange,
    );
    this.auditChartFilterStoreService.loadAuditChartFilterList();
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { AuditChartsStoreService } from '@customer-portal/data-access/audit';
import {
  ChartComponent,
  ChartFilter,
  chartTotalPlugin,
  ChartTypeEnum,
  FilterValue,
} from '@customer-portal/shared';

import {
  AUDIT_STATUS_BAR_GRAPH_OPTIONS,
  AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS,
} from '../../constants';

@Component({
  selector: 'lib-audit-status-charts',
  imports: [CommonModule, TranslocoModule, ChartComponent],
  templateUrl: './audit-status-charts.component.html',
  styleUrl: './audit-status-charts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditStatusChartsComponent implements OnInit, OnDestroy {
  auditStatusDoughnutGraphOptions = AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS;
  auditStatusBarGraphOptions = AUDIT_STATUS_BAR_GRAPH_OPTIONS;
  barType = ChartTypeEnum.Bar;
  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];
  doughnutType = ChartTypeEnum.Doughnut;
  auditStatusDoughnutChartFilters: ChartFilter = { bodyFilter: 'status' };
  auditStatusBarChartFilters: ChartFilter = {
    titleFilter: 'type',
    bodyFilter: 'status',
  };

  constructor(
    public readonly auditChartsStoreService: AuditChartsStoreService,
  ) {}

  ngOnInit(): void {
    this.loadAuditStatusChartsData();
  }

  onChartClick(_event: any): void {}

  onTooltipButtonClick(event: FilterValue[]): void {
    this.auditChartsStoreService.navigateFromChartToListView(event);
  }

  ngOnDestroy(): void {
    this.auditChartsStoreService.resetAuditsGraphsData();
  }

  private loadAuditStatusChartsData(): void {
    this.auditChartsStoreService.loadAuditStatusDoughnutGraphData();
    this.auditChartsStoreService.loadAuditStatusBarGraphData();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { AuditChartsStoreService } from '@customer-portal/data-access/audit';
import {
  ChartComponent,
  ChartFilter,
  chartTotalPlugin,
  ChartTypeEnum,
  FilterValue,
  formatFilter,
  getMonthStartEnd,
} from '@customer-portal/shared';

import {
  AUDIT_DAYS_BAR_GRAPH_OPTIONS,
  AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS,
} from '../../constants';
import { AuditDaysGridComponent } from '../audit-days-charts-grid';

const perLabelColorLegendPlugin = {
  id: 'perLabelColorLegendPlugin',
  afterDraw(chart: any) {
    const { legend } = chart;

    if (!legend || !legend.legendItems) return;

    legend.legendItems.forEach((item: any, index: number) => {
      const color = chart.data.datasets[0].backgroundColor[index];

      const label = legend.legendItems[index];
      if (!label) return;

      label.fontColor = color;
      label.fontWeight = 400;
    });
  },
};
@Component({
  selector: 'lib-audit-days-charts',
  imports: [
    CommonModule,
    TranslocoModule,
    ChartComponent,
    AuditDaysGridComponent,
  ],
  templateUrl: './audit-days-charts.component.html',
  styleUrl: './audit-days-charts.component.scss',
})
export class AuditDaysChartsComponent implements OnInit, OnDestroy {
  chartType = ChartTypeEnum;
  barType = ChartTypeEnum.Bar;
  doughnutType = ChartTypeEnum.Doughnut;
  auditDaysBarOptions = AUDIT_DAYS_BAR_GRAPH_OPTIONS;
  auditDaysDoughnutOptions = AUDIT_STATUS_DOUGHNUT_GRAPH_OPTIONS;
  doughnutTotalPlugin = [
    chartTotalPlugin('doughnutLabel'),
    perLabelColorLegendPlugin,
  ];

  auditDoughnutFilter: ChartFilter = { bodyFilter: 'service' };
  auditDaysBarFilter: ChartFilter = {
    titleFilter: 'type',
    bodyFilter: 'service',
  };

  constructor(
    public readonly auditChartsStoreService: AuditChartsStoreService,
  ) {}

  ngOnInit(): void {
    this.loadAuditDaysChartData();
  }

  onChartClick(_event: any): void {}

  onTooltipButtonClick(event: FilterValue[], chartType: ChartTypeEnum): void {
    let filterValues = event;

    if (chartType === ChartTypeEnum.Bar) {
      filterValues = this.extractDateFiltersBasedOnMonth(event);
    }

    this.auditChartsStoreService.navigateFromChartToListView(filterValues);
  }

  ngOnDestroy(): void {
    this.auditChartsStoreService.resetAuditsGraphsData();
  }

  private loadAuditDaysChartData(): void {
    this.auditChartsStoreService.loadAuditDaysDoughnutGraphData();
    this.auditChartsStoreService.loadAuditDaysBarGraphData();
  }

  private extractDateFiltersBasedOnMonth(event: FilterValue[]): FilterValue[] {
    const month = event[1]?.value?.[0]?.value || '';
    const { startDate, endDate } = getMonthStartEnd(month);

    const transformedEvent = [...event];
    [transformedEvent[1]] = formatFilter([startDate, endDate], 'startDate');

    return transformedEvent;
  }
}

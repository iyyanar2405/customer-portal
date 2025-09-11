import { CommonModule } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  FindingGraphsStoreService,
  getOpenFindingsDateRange,
  OpenFindingsMonthsPeriod,
  OpenFindingsResponse,
} from '@customer-portal/data-access/findings';
import {
  ChartComponent,
  ChartFilter,
  ChartTypeEnum,
  createOrUpdateLegendForCharts,
  FilterValue,
  formatFilter,
  SharedButtonToggleComponent,
  SharedButtonToggleDatum,
} from '@customer-portal/shared';

import { OPEN_FINDINGS_GRAPH_OPTIONS } from './open-findings-graphs-options.constants';

@Component({
  selector: 'lib-open-findings',
  imports: [
    CommonModule,
    TranslocoDirective,
    ChartComponent,
    SharedButtonToggleComponent,
  ],
  templateUrl: './open-findings.component.html',
  styleUrl: './open-findings.component.scss',
})
export class OpenFindingsComponent implements OnInit, OnDestroy {
  barType = ChartTypeEnum.Bar;
  openFindingsMonthsPeriod = OpenFindingsMonthsPeriod;
  openFindingsGraphOptions = OPEN_FINDINGS_GRAPH_OPTIONS;
  sharedLegendId = 'shared-legend';
  openFindingsChartFilters: ChartFilter = {
    titleFilter: 'services',
    bodyFilter: 'category',
  };

  public responseToggleOptions: SharedButtonToggleDatum<string>[] = [
    {
      i18nKey: 'buttons.toggle.noResponse',
      label: 'No response',
      value: OpenFindingsResponse.NoResponse,
      isActive: true,
    },
    {
      i18nKey: 'buttons.toggle.response',
      label: 'Response',
      value: OpenFindingsResponse.Response,
      isActive: false,
    },
  ];

  openFindingsData = computed(() => ({
    overdueGraphData:
      this.findingGraphsStoreService.overdueFindingsGraphData().data,
    becomingOverdueGraphData:
      this.findingGraphsStoreService.becomingOverdueFindingsGraphData().data,
    inProgressGraphData:
      this.findingGraphsStoreService.inProgressFindingsGraphData().data,
    earlyStageGraphData:
      this.findingGraphsStoreService.earlyStageFindingsGraphData().data,
  }));

  @ViewChildren(ChartComponent) chartComponents!: QueryList<ChartComponent>;

  constructor(
    public readonly findingGraphsStoreService: FindingGraphsStoreService,
  ) {
    effect(() => {
      this.openFindingsData();
      afterNextRender(() => {
        this.refreshLegend();
      });
    });
  }

  ngOnInit(): void {
    this.findingGraphsStoreService.loadOpenFindingsGraphData();
  }

  onLegendClick(_event: any): void {
    createOrUpdateLegendForCharts(
      this.sharedLegendId,
      this.chartComponents.toArray(),
    );
  }

  onChartClick(_event: any): void {}

  onResponseChange(response: any): void {
    this.findingGraphsStoreService.updateOpenFindingsResponse(response);
    this.findingGraphsStoreService.loadOpenFindingsGraphData();
  }

  onTooltipClick(
    filters: FilterValue[],
    period: OpenFindingsMonthsPeriod,
  ): void {
    const dateFilter: FilterValue[] =
      this.extractFilterValuesBasedOnPeriod(period);

    this.findingGraphsStoreService.navigateFromChartToListView([
      ...filters,
      ...dateFilter,
    ]);
  }

  ngOnDestroy(): void {
    this.findingGraphsStoreService.resetFindingsGraphData();
  }

  private refreshLegend(): void {
    if (this.chartComponents?.length) {
      createOrUpdateLegendForCharts(
        this.sharedLegendId,
        this.chartComponents.toArray(),
      );
    }
  }

  private extractFilterValuesBasedOnPeriod(
    period: OpenFindingsMonthsPeriod,
  ): FilterValue[] {
    if (period === OpenFindingsMonthsPeriod.Overdue) return [];

    const { startDate, endDate } = getOpenFindingsDateRange(period);

    return formatFilter([startDate, endDate], 'openDate');
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  FindingChartFilterKey,
  FindingChartFilterStoreService,
  FindingGraphsStoreService,
} from '@customer-portal/data-access/findings';
import {
  getTimeRange,
  SharedSelectDateRangeComponent,
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
  TimeRange,
} from '@customer-portal/shared';

import { FindingGraphsTabViewComponent } from '../finding-graphs-tab-view';

@Component({
  selector: 'lib-finding-chart',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectDateRangeComponent,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
    FindingGraphsTabViewComponent,
  ],
  providers: [FindingChartFilterStoreService, FindingGraphsStoreService],
  templateUrl: './finding-chart.component.html',
  styleUrl: './finding-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingChartComponent implements OnInit, OnDestroy {
  dateRangeIsDisabled = false;
  chartFilterKey = FindingChartFilterKey;
  timeRange = TimeRange;
  lastTimeRange: Date[] = [];

  constructor(
    public readonly findingChartFilterStoreService: FindingChartFilterStoreService,
    public readonly findingGraphsStoreService: FindingGraphsStoreService,
  ) {}

  ngOnInit(): void {
    this.loadGraphsFilterList();
  }

  onFilterChange(data: unknown, key: FindingChartFilterKey): void {
    this.findingChartFilterStoreService.updateFindingChartFilterByKey(
      data,
      key,
    );
    this.findingGraphsStoreService.loadFindingsGraphsData();
  }

  onDisableFilterEvent(value: boolean): void {
    this.dateRangeIsDisabled = value;

    if (!value && this.lastTimeRange.length) {
      this.findingChartFilterStoreService.updateFindingChartFilterByKey(
        this.lastTimeRange,
        FindingChartFilterKey.TimeRange,
      );
    }

    if (value) {
      this.lastTimeRange =
        this.findingChartFilterStoreService.filterDateRange();
      this.timeRange = TimeRange;
      this.findingChartFilterStoreService.updateFindingChartFilterByKey(
        getTimeRange(TimeRange.YearCustom),
        FindingChartFilterKey.TimeRange,
      );
    } else {
      this.lastTimeRange = [];
    }
  }

  ngOnDestroy(): void {
    this.findingGraphsStoreService.resetFindingsGraphsState();
  }

  private loadGraphsFilterList(): void {
    this.findingChartFilterStoreService.updateFindingChartFilterByKey(
      getTimeRange(TimeRange.YearCurrent),
      FindingChartFilterKey.TimeRange,
    );
    this.findingChartFilterStoreService.loadFindingChartFilterList();
  }
}

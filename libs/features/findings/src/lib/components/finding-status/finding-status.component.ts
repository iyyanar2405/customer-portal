import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';
import {
  ChartComponent,
  ChartFilter,
  chartTotalPlugin,
  ChartTypeEnum,
} from '@customer-portal/shared';

import { FINDING_BY_CATEGORY_GRAPH_OPTIONS } from './finding-category-graph-options.constants';
import { FINDING_BY_STATUS_GRAPH_OPTIONS } from './finding-status-options.constants';

@Component({
  selector: 'lib-finding-status',
  imports: [CommonModule, TranslocoModule, ChartComponent],
  templateUrl: './finding-status.component.html',
  styleUrl: './finding-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingStatusComponent implements OnInit, OnDestroy {
  findingsByCategoryGraphOptions = FINDING_BY_CATEGORY_GRAPH_OPTIONS;
  findingsByStatusGraphOptions = FINDING_BY_STATUS_GRAPH_OPTIONS;
  doughnutTotalPlugin = [chartTotalPlugin('doughnutLabel')];
  barType = ChartTypeEnum.Bar;
  doughnutType = ChartTypeEnum.Doughnut;
  findingsByStatusChartFilters: ChartFilter = {
    bodyFilter: 'status',
  };
  findingsByCategoryChartFilters: ChartFilter = {
    titleFilter: 'category',
    bodyFilter: 'status',
  };

  constructor(
    public readonly findingGraphsStoreService: FindingGraphsStoreService,
  ) {}

  ngOnInit(): void {
    this.loadFindingStatusGraphsData();
  }

  onChartClick(_event: any): void {}

  ngOnDestroy(): void {
    this.findingGraphsStoreService.resetFindingsGraphData();
  }

  private loadFindingStatusGraphsData(): void {
    this.findingGraphsStoreService.loadFindingStatusByCategoryGraphData();
    this.findingGraphsStoreService.loadFindingsByStatusGraphsData();
  }
}

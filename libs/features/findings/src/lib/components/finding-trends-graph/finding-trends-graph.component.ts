import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { FindingGraphsStoreService } from '@customer-portal/data-access/findings';
import {
  ChartComponent,
  ChartFilter,
  ChartTypeEnum,
  TreeTableComponent,
  TrendsChartInterval,
} from '@customer-portal/shared';

import { FINDINGS_GRAPH_LINE_OPTIONS } from './finding-graph-line-options.constants';

@Component({
  selector: 'lib-finding-trends-graph',
  imports: [
    CommonModule,
    TranslocoDirective,
    ChartComponent,
    TreeTableComponent,
  ],
  templateUrl: './finding-trends-graph.component.html',
  styleUrl: './finding-trends-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingTrendsGraphComponent implements OnInit, OnDestroy {
  lineType = ChartTypeEnum.Line;
  findingsGraphLineOptions = FINDINGS_GRAPH_LINE_OPTIONS;
  findingTrendsChartFilters: ChartFilter = {
    titleFilter: {
      interval: TrendsChartInterval.Year,
      field: 'openDate',
    },
    bodyFilter: 'category',
  };

  constructor(public findingGraphsStoreService: FindingGraphsStoreService) {}

  ngOnInit(): void {
    this.findingGraphsStoreService.loadFindingsByCategoryGraphData();
    this.findingGraphsStoreService.loadFindingsDataTrends();
  }

  ngOnDestroy(): void {
    this.findingGraphsStoreService.resetFindingsGraphData();
  }
}

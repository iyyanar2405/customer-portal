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
  FindingGraphsStoreService,
  FindingTabs,
} from '@customer-portal/data-access/findings';

import { FindingStatusComponent } from '../finding-status/finding-status.component';
import { FindingTrendsGraphComponent } from '../finding-trends-graph';
import { FindingsByClauseComponent } from '../findings-by-clause';
import { FindingsBySiteComponent } from '../findings-by-site';
import { OpenFindingsComponent } from '../open-findings';

@Component({
  selector: 'lib-finding-graphs-tab-view',
  imports: [
    CommonModule,
    TabViewModule,
    TranslocoDirective,
    FindingTrendsGraphComponent,
    OpenFindingsComponent,
    FindingStatusComponent,
    FindingsByClauseComponent,
    FindingsBySiteComponent,
  ],
  templateUrl: './finding-graphs-tab-view.component.html',
  styleUrl: './finding-graphs-tab-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindingGraphsTabViewComponent {
  private readonly tabsMapping: FindingTabs[] = [
    FindingTabs.FindingStatus,
    FindingTabs.OpenFindings,
    FindingTabs.FindingsByClause,
    FindingTabs.FindingsBySite,
    FindingTabs.Trends,
  ];

  @Output() disableFilterEvent = new EventEmitter<boolean>();

  readonly FindingTabs = FindingTabs;
  activeTab = FindingTabs.FindingStatus;

  constructor(
    private readonly findingGraphsStoreService: FindingGraphsStoreService,
  ) {}

  onTabChange(event: TabViewChangeEvent): void {
    this.activeTab = this.tabsMapping[event.index];
    this.findingGraphsStoreService.setActiveFindingsTab(this.activeTab);
    this.disableFilterEvent.emit(this.activeTab === FindingTabs.Trends);
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  OverviewFilterKey,
  OverviewFilterStoreService,
  OverviewFilterTypes,
} from '@customer-portal/data-access/overview';
import {
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-overview-filters',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
  ],
  templateUrl: './overview-filters.component.html',
  styleUrl: './overview-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OverviewFilterStoreService],
})
export class OverviewFiltersComponent implements OnInit {
  overviewFilterType = OverviewFilterTypes;

  constructor(
    public readonly overviewFilterStoreService: OverviewFilterStoreService,
  ) {}

  ngOnInit(): void {
    this.overviewFilterStoreService.loadOverviewFilterList();
  }

  onFilterChange(data: unknown, key: OverviewFilterKey): void {
    this.overviewFilterStoreService.updateOverviewFilterByKey(data, key);
  }
}

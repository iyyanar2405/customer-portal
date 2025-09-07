import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import {
  ScheduleCalendarFilterKey,
  ScheduleCalendarFilterStoreService,
  ScheduleCalendarFilterTypes,
} from '@customer-portal/data-access/schedules';
import {
  SharedSelectMultipleComponent,
  SharedSelectTreeComponent,
} from '@customer-portal/shared';

@Component({
  selector: 'lib-schedule-calendar-filters',
  imports: [
    CommonModule,
    TranslocoDirective,
    SharedSelectMultipleComponent,
    SharedSelectTreeComponent,
  ],
  templateUrl: './schedule-calendar-filters.component.html',
  styleUrl: './schedule-calendar-filters.component.scss',
  providers: [ScheduleCalendarFilterStoreService],
})
export class ScheduleCalendarFiltersComponent implements OnInit {
  public filterTypes = ScheduleCalendarFilterTypes;

  constructor(
    public scheduleCalendarFilterStoreService: ScheduleCalendarFilterStoreService,
  ) {}

  ngOnInit(): void {
    this.scheduleCalendarFilterStoreService.loadScheduleCalendarFilterList();
  }

  onFilterChange(data: unknown, key: ScheduleCalendarFilterKey): void {
    this.scheduleCalendarFilterStoreService.updateScheduleCalendarFilterByKey(
      data,
      key,
    );
  }
}

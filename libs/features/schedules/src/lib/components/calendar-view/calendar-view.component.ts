import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ofActionSuccessful } from '@ngxs/store';
import { DialogService } from 'primeng/dynamicdialog';
import { filter, tap } from 'rxjs';

import {
  CalendarScheduleStoreService,
  SCHEDULE_STATUS_MAP,
  ScheduleCalendarFilterStoreService,
  ScheduleCalendarFilterTypes,
  UpdateScheduleCalendarConfirmSuccess,
  UpdateScheduleCalendarRescheduleSuccess,
} from '@customer-portal/data-access/schedules';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import { BasePreferencesComponent } from '@customer-portal/preferences';
import {
  CalendarViewType,
  CustomFullCalendarComponent,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared';

import { CalendarPrefenceModel } from '../../models';
import { ScheduleCalendarEventService } from '../../services';
import { ScheduleCalendarFiltersComponent } from '../schedule-calendar-filters';

@Component({
  selector: 'lib-calendar-view',
  imports: [
    CommonModule,
    CustomFullCalendarComponent,
    ScheduleCalendarFiltersComponent,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DialogService,
    CalendarScheduleStoreService,
    OverviewSharedStoreService,
    ScheduleCalendarEventService,
    ScheduleCalendarFilterStoreService,
  ],
})
export class CalendarViewComponent
  extends BasePreferencesComponent
  implements OnDestroy
{
  private preference: CalendarPrefenceModel = {
    filters: {},
    view: CalendarViewType.Month,
  };
  private isInitialized = signal(false);
  private lastSavedPreference: CalendarPrefenceModel | null = null;
  private preferenceCalendarFilters = computed(() => ({
    companies: this.scheduleCalendarFilterStoreService.filterCompanies(),
    services: this.scheduleCalendarFilterStoreService.filterServices(),
    sites: this.scheduleCalendarFilterStoreService.filterSites(),
    statuses: this.scheduleCalendarFilterStoreService.filterStatuses(),
  }));

  public readonly scheduleStatusMap = SCHEDULE_STATUS_MAP;
  public readonly calendarViewType = computed(() =>
    this.overviewSharedStoreService.overviewUpcomingAuditSelectedDate()
      ? CalendarViewType.Month
      : this.preferenceData().view,
  );
  public isPreferenceInitialized = this.preferenceDataLoaded.pipe(
    filter((value) => value),
    tap(() => {
      this.setFilterPrefillByKey();
      this.preference = structuredClone(this.preferenceData());
      this.lastSavedPreference = JSON.parse(JSON.stringify(this.preference));
      this.calendarScheduleStoreService.updateCalendarSchedulePreferenceSet(
        true,
      );
      this.isInitialized.set(true);
    }),
  );

  constructor(
    private readonly scheduleCalendarEventService: ScheduleCalendarEventService,
    private readonly scheduleCalendarFilterStoreService: ScheduleCalendarFilterStoreService,
    protected readonly calendarScheduleStoreService: CalendarScheduleStoreService,
    protected readonly overviewSharedStoreService: OverviewSharedStoreService,
  ) {
    super();

    this.initializePreferences(
      PageName.ScheduleList,
      ObjectName.Schedules,
      ObjectType.Calendar,
    );

    effect(() => {
      if (!this.isInitialized()) return;
      const newFilters = this.preferenceCalendarFilters();

      if (this.hasFiltersChanged(newFilters, this.preference.filters)) {
        this.preference = {
          ...this.preference,
          filters: this.preferenceCalendarFilters(),
        };
        this.savePreferencesIfChanged();
      }
    });

    this.setActionsObs();
  }

  setActionsObs(): void {
    this.actions$
      .pipe(
        ofActionSuccessful(
          UpdateScheduleCalendarConfirmSuccess,
          UpdateScheduleCalendarRescheduleSuccess,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.calendarScheduleStoreService.loadCalendarSchedule();
      });
  }

  setFilterPrefillByKey(): void {
    const actionsMap = {
      [ScheduleCalendarFilterTypes.Companies]: (d: number[]) =>
        this.scheduleCalendarFilterStoreService.updateScheduleCalendarFilterCompanies(
          d,
        ),
      [ScheduleCalendarFilterTypes.Services]: (d: number[]) =>
        this.scheduleCalendarFilterStoreService.updateScheduleCalendarFilterServices(
          d,
        ),
      [ScheduleCalendarFilterTypes.Sites]: (_: any[]) => {}, // will update once solution is found
      [ScheduleCalendarFilterTypes.Statuses]: (d: number[]) =>
        this.scheduleCalendarFilterStoreService.updateScheduleCalendarFilterStatuses(
          d,
        ),
    };

    Object.entries(this.preferenceData().filters).forEach(([key, dataList]) => {
      if (Array.isArray(dataList) && dataList.length && key in actionsMap) {
        actionsMap[key as ScheduleCalendarFilterTypes](dataList);
      }
    });
  }

  ngOnDestroy(): void {
    this.overviewSharedStoreService.resetOverviewSharedState();
  }

  onChangeDate({ currentMonth, currentYear }: Record<string, number>): void {
    this.calendarScheduleStoreService.loadCalendarSchedule({
      month: currentMonth,
      year: currentYear,
      ...this.preferenceData().filters,
    });

    if (!this.isAuditsWidgetNavigation()) {
      const newView = this.getPreferenceCalendarView(currentMonth);

      if (this.preference.view !== newView) {
        this.preference.view = newView;
        this.savePreferencesIfChanged();
      }
    }
  }

  onClickEvent({
    id,
    status,
    date,
  }: {
    id: number;
    status: string;
    date: string;
  }): void {
    this.scheduleCalendarEventService.onOpenDetailsModal(
      Number(id),
      status,
      date,
    );
  }

  private getPreferenceCalendarView(currentMonth: number): CalendarViewType {
    return currentMonth > 0 ? CalendarViewType.Month : CalendarViewType.Year;
  }

  private isAuditsWidgetNavigation(): boolean {
    return !!this.overviewSharedStoreService.overviewUpcomingAuditSelectedDate();
  }

  private savePreferencesIfChanged(): void {
    if (!this.lastSavedPreference || this.hasPreferenceChanged()) {
      this.savePreferences(this.preference);
      this.lastSavedPreference = JSON.parse(JSON.stringify(this.preference));
    }
  }

  private hasFiltersChanged(newFilters: any, currentFilters: any): boolean {
    return JSON.stringify(newFilters) !== JSON.stringify(currentFilters);
  }

  private hasPreferenceChanged(): boolean {
    if (!this.lastSavedPreference) return true;

    if (this.preference.view !== this.lastSavedPreference.view) {
      return true;
    }

    const currentFilters = this.preference.filters;
    const lastFilters = this.lastSavedPreference.filters;

    const currentKeys = Object.keys(currentFilters);
    const lastKeys = Object.keys(lastFilters);

    if (currentKeys.length !== lastKeys.length) {
      return true;
    }

    return currentKeys.some((key) => {
      const currentValue = currentFilters[key as ScheduleCalendarFilterTypes];
      const lastValue = lastFilters[key as ScheduleCalendarFilterTypes];

      if (Array.isArray(currentValue) && Array.isArray(lastValue)) {
        return (
          currentValue.length !== lastValue.length ||
          !currentValue.every((val, idx) => val === lastValue[idx])
        );
      }

      return currentValue !== lastValue;
    });
  }
}

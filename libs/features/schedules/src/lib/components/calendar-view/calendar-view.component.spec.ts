import { runInInjectionContext, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, NgxsModule } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

import { createOverviewSharedStoreServiceMock } from '@customer-portal/data-access/overview';
import {
  CalendarScheduleStoreService,
  createCalendarScheduleStoreServiceMock,
  createScheduleCalendarFilterStoreServiceMock,
  SCHEDULE_STATUS_MAP,
  ScheduleCalendarFilterStoreService,
} from '@customer-portal/data-access/schedules';
import { OverviewSharedStoreService } from '@customer-portal/overview-shared';
import {
  createPreferenceMockInjector,
  PreferenceStoreService,
} from '@customer-portal/preferences';
import {
  createTranslationServiceMock,
  ObjectName,
  ObjectType,
  PageName,
} from '@customer-portal/shared';

import { ScheduleCalendarEventService } from '../../services';
import { CalendarViewComponent } from './calendar-view.component';

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;
  let calendarScheduleStoreServiceMock: Partial<CalendarScheduleStoreService>;
  let translocoServiceMock: Partial<TranslocoService>;
  let scheduleEventService: Partial<ScheduleCalendarEventService>;
  let scheduleCalendarFilterStoreServiceMock: Partial<ScheduleCalendarFilterStoreService>;
  let preferenceStoreServiceMock: Partial<PreferenceStoreService>;
  let overviewSharedStoreServiceMock: Partial<OverviewSharedStoreService>;
  const apolloMock: Partial<Apollo> = {
    use: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };

  beforeEach(() => {
    const injector = createPreferenceMockInjector();

    calendarScheduleStoreServiceMock = createCalendarScheduleStoreServiceMock();
    translocoServiceMock = createTranslationServiceMock();
    scheduleEventService = {
      onOpenDetailsModal: jest.fn(),
      onOpenRescheduleModal: jest.fn(),
      onOpenConfirmModal: jest.fn(),
    };
    scheduleCalendarFilterStoreServiceMock =
      createScheduleCalendarFilterStoreServiceMock();
    overviewSharedStoreServiceMock = createOverviewSharedStoreServiceMock();

    preferenceStoreServiceMock = {
      getData: jest.fn(),
      loadPreference: jest.fn(),
      savePreference: jest.fn(),
    };

    runInInjectionContext(injector, () => {
      TestBed.configureTestingModule({
        imports: [CalendarViewComponent, NgxsModule.forRoot([])],
        providers: [
          {
            provide: TranslocoService,
            useValue: translocoServiceMock,
          },
          {
            provide: ScheduleCalendarEventService,
            useValue: scheduleEventService,
          },
          {
            provide: PreferenceStoreService,
            useValue: preferenceStoreServiceMock,
          },
          {
            provide: Actions,
            useValue: of(),
          },
          {
            provide: Apollo,
            useValue: apolloMock,
          },
        ],
      })
        .overrideProvider(CalendarScheduleStoreService, {
          useValue: calendarScheduleStoreServiceMock,
        })
        .overrideProvider(ScheduleCalendarFilterStoreService, {
          useValue: scheduleCalendarFilterStoreServiceMock,
        })
        .overrideProvider(OverviewSharedStoreService, {
          useValue: overviewSharedStoreServiceMock,
        })
        .compileComponents();
      fixture = TestBed.createComponent(CalendarViewComponent);
      component = fixture.componentInstance;
    });
  });

  test('should set properties correctly', () => {
    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.scheduleStatusMap).toStrictEqual(SCHEDULE_STATUS_MAP);
    expect(component['preferenceCalendarFilters']()).toStrictEqual({
      companies: [],
      services: [],
      sites: [1],
      statuses: [2, 3],
    });
  });

  test('should call loadCalendarSchedule during onChangeDate correctly', () => {
    // Arrange
    (component['preferenceData'] as WritableSignal<any>) = signal({
      filters: {},
    });

    // Act
    component.onChangeDate({ currentMonth: 1, currentYear: 2024 });

    // Assert
    expect(
      calendarScheduleStoreServiceMock.loadCalendarSchedule,
    ).toHaveBeenCalledWith({
      month: 1,
      year: 2024,
    });
  });

  test('should call savePreferences during onChangeDate correctly', () => {
    // Arrange
    jest
      .spyOn(component as any, 'isAuditsWidgetNavigation')
      .mockReturnValue(false);
    (component['preferenceData'] as WritableSignal<any>) = signal({
      filters: {},
      view: 'dayGridMonth',
    });

    const savePreferencesIfChangedSpy = jest.spyOn(
      component as any,
      'savePreferencesIfChanged',
    );

    const savePreferencesSpy = jest.spyOn(component as any, 'savePreferences');

    jest.spyOn(component as any, 'hasPreferenceChanged').mockReturnValue(true);

    component.onChangeDate({ currentMonth: 1, currentYear: 2024 });

    expect(savePreferencesIfChangedSpy).not.toHaveBeenCalled();

    component.onChangeDate({ currentMonth: -1, currentYear: 2024 });

    expect(savePreferencesIfChangedSpy).toHaveBeenCalled();
    expect(savePreferencesSpy).toHaveBeenCalledWith({
      view: 'multiMonthYear',
      filters: {},
    });
    expect(
      (component as any).preferenceStoreService.savePreference,
    ).toHaveBeenCalledWith({
      pageName: PageName.ScheduleList,
      objectName: ObjectName.Schedules,
      objectType: ObjectType.Calendar,
      data: {
        view: 'multiMonthYear',
        filters: {},
      },
    });
  });

  test('should compute getPreferenceCalendarView correctly', () => {
    // Arrange
    const viewTypeMonth = component['getPreferenceCalendarView'](5);
    const viewTypeYear = component['getPreferenceCalendarView'](-1);

    // Assert
    expect(viewTypeMonth).toBe('dayGridMonth');
    expect(viewTypeYear).toBe('multiMonthYear');
  });

  test('should reset overview shared state on component destruction', () => {
    // Act
    component.ngOnDestroy();

    // Assert
    expect(
      overviewSharedStoreServiceMock.resetOverviewSharedState,
    ).toHaveBeenCalled();
  });
});

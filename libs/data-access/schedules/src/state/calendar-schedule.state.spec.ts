import { TestBed } from '@angular/core/testing';
import { StateContext } from '@ngxs/store';
import { of } from 'rxjs';

import { RouteStoreService } from '@customer-portal/router';

import { CalendarScheduleDataDto } from '../dtos';
import { CalendarScheduleModel } from '../models';
import { CalendarScheduleService } from '../services';
import {
  LoadCalendarSchedule,
  LoadCalendarScheduleSuccess,
  UpdateCalendarScheduleMonth,
  UpdateCalendarSchedulePreferenceSet,
  UpdateCalendarScheduleYear,
} from './actions';
import { CalendarScheduleState } from './calendar-schedule.state';

describe('CalendarScheduleState', () => {
  let state: CalendarScheduleState;
  let ctx: StateContext<any>;
  let calendarScheduleServiceMock: any;
  let routeStoreServiceMock: any;

  beforeEach(() => {
    calendarScheduleServiceMock = {
      getCalendarSchedule: jest.fn(),
      getCalendarFilterList: jest.fn(),
    };

    routeStoreServiceMock = {
      getQueryParamByKey: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        CalendarScheduleState,
        {
          provide: CalendarScheduleService,
          useValue: calendarScheduleServiceMock,
        },
        {
          provide: RouteStoreService,
          useValue: routeStoreServiceMock,
        },
      ],
    });
    state = TestBed.inject(CalendarScheduleState);

    ctx = {
      getState: jest.fn(() => ({
        calendarSchedule: [],
        filterList: [],
        isPreferenceSet: true,
        month: 0,
        year: 2024,
      })),
      setState: jest.fn(),
      patchState: jest.fn(),
      dispatch: jest.fn(),
    };
  });

  describe('loadCalendarSchedule', () => {
    test('should dispatch LoadCalendarScheduleSuccess on successful load', (done) => {
      // Arrange
      const calendarScheduleData: CalendarScheduleDataDto[] = [
        {
          auditType: 'Initial Audit',
          city: 'Auckland',
          company: 'Opentech',
          endDate: '2024-07-09',
          leadAuditor: 'Arne Arnesson',
          services: ['ISO 540001:2018'],
          site: 'Opentech (NZ)',
          siteAddress: 'Site Address 1',
          siteAuditId: '2',
          siteRepresentatives: ['Jessie McGrath'],
          startDate: '2024-07-05',
          status: 'Confirmed',
        },
        {
          auditType: 'Surveillance Audit',
          city: 'Amsterdam',
          company: 'Enrich Solar',
          endDate: '2024-06-14',
          leadAuditor: 'Jane Smith',
          services: ['ISO 14001:2015'],
          site: 'Enrich Solar Services Private Limited',
          siteAddress: 'Site Address 2',
          siteAuditId: '4',
          siteRepresentatives: ['Sam Williams'],
          startDate: '2024-06-12',
          status: 'To Be Confirmed',
        },
      ];
      const calendarScheduleResponse: CalendarScheduleModel[] = [
        {
          address: 'Site Address 1',
          auditType: 'Initial Audit',
          city: 'Auckland',
          company: 'Opentech',
          endDate: '2024-07-09',
          leadAuditor: 'Arne Arnesson',
          scheduleId: '2',
          service: 'ISO 540001:2018',
          site: 'Opentech (NZ)',
          siteRepresentative: 'Jessie McGrath',
          startDate: '2024-07-05',
          status: 'Confirmed',
        },
        {
          address: 'Site Address 2',
          auditType: 'Surveillance Audit',
          city: 'Amsterdam',
          company: 'Enrich Solar',
          endDate: '2024-06-14',
          leadAuditor: 'Jane Smith',
          scheduleId: '4',
          service: 'ISO 14001:2015',
          site: 'Enrich Solar Services Private Limited',
          siteRepresentative: 'Sam Williams',
          startDate: '2024-06-12',
          status: 'To Be Confirmed',
        },
      ];

      // Act
      calendarScheduleServiceMock.getCalendarSchedule.mockReturnValue(
        of({ isSuccess: true, data: calendarScheduleData }),
      );
      state
        .loadCalendarSchedule(ctx, new LoadCalendarSchedule())
        .subscribe(() => {
          // Assert
          expect(ctx.dispatch).toHaveBeenCalledWith(
            new LoadCalendarScheduleSuccess(calendarScheduleResponse),
          );
          done();
        });
    });

    test('should dispatch LoadCalendarScheduleSuccess with empty array if data dto is undefined', (done) => {
      // Arrange
      const calendarScheduleData = undefined;

      // Act
      calendarScheduleServiceMock.getCalendarSchedule.mockReturnValue(
        of({ isSuccess: true, data: calendarScheduleData }),
      );
      state
        .loadCalendarSchedule(ctx, new LoadCalendarSchedule())
        .subscribe(() => {
          // Assert
          expect(ctx.dispatch).toHaveBeenCalledWith(
            new LoadCalendarScheduleSuccess([]),
          );
          done();
        });
    });

    test('should dispatch UpdateCalendarScheduleMonth and UpdateCalendarScheduleYear if params are provided', (done) => {
      // Arrange
      const calendarScheduleData: CalendarScheduleDataDto[] = [
        {
          auditType: 'Initial Audit',
          city: 'Auckland',
          company: 'Opentech',
          endDate: '2024-07-09T00:00:00.000+00:00',
          leadAuditor: 'Arne Arnesson',
          services: ['ISO 540001:2018'],
          site: 'Opentech (NZ)',
          siteAddress: 'Site Address 1',
          siteAuditId: '2',
          siteRepresentatives: ['Jessie McGrath'],
          startDate: '2024-07-05T00:00:00.000+00:00',
          status: 'Confirmed',
        },
        {
          auditType: 'Surveillance Audit',
          city: 'Amsterdam',
          company: 'Enrich Solar',
          endDate: '2024-06-14T00:00:00.000+00:00',
          leadAuditor: 'Jane Smith',
          services: ['ISO 14001:2015'],
          site: 'Enrich Solar Services Private Limited',
          siteAddress: 'Site Address 2',
          siteAuditId: '4',
          siteRepresentatives: ['Sam Williams'],
          startDate: '2024-06-12T00:00:00.000+00:00',
          status: 'To Be Confirmed',
        },
      ];
      const params = { month: 5, year: 2024 };

      // Act
      calendarScheduleServiceMock.getCalendarSchedule.mockReturnValue(
        of({ isSuccess: true, data: calendarScheduleData }),
      );
      state
        .loadCalendarSchedule(ctx, new LoadCalendarSchedule(params))
        .subscribe(() => {
          // Assert
          expect(ctx.dispatch).toHaveBeenCalledWith(
            new UpdateCalendarScheduleMonth(5),
          );
          expect(ctx.dispatch).toHaveBeenCalledWith(
            new UpdateCalendarScheduleYear(2024),
          );
          done();
        });
    });
  });

  describe('updateCalendarScheduleMonth', () => {
    test('should update month in state', () => {
      // Arrange
      const month = 5;

      // Act
      state.updateCalendarScheduleMonth(
        ctx,
        new UpdateCalendarScheduleMonth(month),
      );

      // Assert
      expect(ctx.patchState).toHaveBeenCalledWith({ month });
    });
  });

  describe('updateCalendarScheduleYear', () => {
    test('should update year in state', () => {
      // Arrange
      const year = 2024;

      // Act
      state.updateCalendarScheduleYear(
        ctx,
        new UpdateCalendarScheduleYear(year),
      );

      // Assert
      expect(ctx.patchState).toHaveBeenCalledWith({ year });
    });
  });

  describe('updateCalendarSchedulePreferenceSet', () => {
    test('should update isPreferenceSet in state', () => {
      // Arrange
      const isPreferenceSet = true;

      // Act
      state.updateCalendarSchedulePreferenceSet(
        ctx,
        new UpdateCalendarSchedulePreferenceSet(isPreferenceSet),
      );

      // Assert
      expect(ctx.patchState).toHaveBeenCalledWith({ isPreferenceSet });
    });
  });
});

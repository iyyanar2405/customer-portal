import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { map, tap } from 'rxjs';

import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { ScheduleCalendarFilterTypes } from '../constants';
import { CalendarSchedulePayloadDto, ScheduleCalendarFilterDto } from '../dtos';
import { CalendarScheduleModel, CalendarScheduleParams } from '../models';
import {
  CalendarScheduleMapperService,
  CalendarScheduleService,
} from '../services';
import {
  LoadCalendarSchedule,
  LoadCalendarScheduleSuccess,
  LoadScheduleCalendarFilterCompanies,
  LoadScheduleCalendarFilterCompaniesSuccess,
  LoadScheduleCalendarFilterList,
  LoadScheduleCalendarFilterServices,
  LoadScheduleCalendarFilterServicesSuccess,
  LoadScheduleCalendarFilterSites,
  LoadScheduleCalendarFilterSitesSuccess,
  LoadScheduleCalendarFilterStatuses,
  LoadScheduleCalendarFilterStatusesSuccess,
  UpdateCalendarScheduleMonth,
  UpdateCalendarSchedulePreferenceSet,
  UpdateCalendarScheduleYear,
  UpdateScheduleCalendarFilterByKey,
  UpdateScheduleCalendarFilterCompanies,
  UpdateScheduleCalendarFilterServices,
  UpdateScheduleCalendarFilterSites,
  UpdateScheduleCalendarFilterStatuses,
} from './actions';

export interface CalendarScheduleStateModel {
  calendarSchedule: CalendarScheduleModel[];
  isPreferenceSet: boolean;
  month: number;
  year: number;
  filterCompanies: number[];
  filterServices: number[];
  filterSites: number[];
  filterStatuses: number[];
  dataCompanies: SharedSelectMultipleDatum<number>[];
  dataServices: SharedSelectMultipleDatum<number>[];
  dataSites: TreeNode[];
  dataStatuses: SharedSelectMultipleDatum<number>[];
  prefillSites: TreeNode[];
}

const defaultState: CalendarScheduleStateModel = {
  calendarSchedule: [],
  isPreferenceSet: false,
  month: 0,
  year: 0,
  filterCompanies: [],
  filterServices: [],
  filterSites: [],
  filterStatuses: [],
  dataCompanies: [],
  dataServices: [],
  dataSites: [],
  dataStatuses: [],
  prefillSites: [],
};

@State<CalendarScheduleStateModel>({
  name: 'calendarSchedule',
  defaults: defaultState,
})
@Injectable()
export class CalendarScheduleState {
  constructor(private calendarScheduleService: CalendarScheduleService) {}

  @Action(LoadCalendarSchedule)
  loadCalendarSchedule(
    ctx: StateContext<CalendarScheduleStateModel>,
    { params }: LoadCalendarSchedule,
  ) {
    const state = ctx.getState();

    return this.calendarScheduleService
      .getCalendarSchedule(this.getCalendarScheduleParams(state, params))
      .pipe(
        map((calendarScheduleDto) =>
          calendarScheduleDto.isSuccess && calendarScheduleDto.data
            ? calendarScheduleDto.data
            : [],
        ),
        tap((data) => {
          const calendarSchedule =
            CalendarScheduleMapperService.mapToCalendarScheduleModel(data);

          if (calendarSchedule) {
            ctx.dispatch(new LoadCalendarScheduleSuccess(calendarSchedule));
          }

          if (params?.month || params?.month === 0) {
            ctx.dispatch(new UpdateCalendarScheduleMonth(params.month));
          }

          if (params?.year) {
            ctx.dispatch(new UpdateCalendarScheduleYear(params.year));
          }
        }),
      );
  }

  @Action(LoadCalendarScheduleSuccess)
  loadCalendarScheduleSuccess(
    ctx: StateContext<CalendarScheduleStateModel>,
    { calendarSchedule }: LoadCalendarScheduleSuccess,
  ) {
    ctx.patchState({ calendarSchedule });
  }

  @Action(UpdateCalendarScheduleMonth)
  updateCalendarScheduleMonth(
    ctx: StateContext<CalendarScheduleStateModel>,
    { month }: UpdateCalendarScheduleMonth,
  ) {
    ctx.patchState({ month });
  }

  @Action(UpdateCalendarScheduleYear)
  updateCalendarScheduleYear(
    ctx: StateContext<CalendarScheduleStateModel>,
    { year }: UpdateCalendarScheduleYear,
  ) {
    ctx.patchState({ year });
  }

  @Action(UpdateCalendarSchedulePreferenceSet)
  updateCalendarSchedulePreferenceSet(
    ctx: StateContext<CalendarScheduleStateModel>,
    { isPreferenceSet }: UpdateCalendarSchedulePreferenceSet,
  ) {
    ctx.patchState({ isPreferenceSet });
  }

  // #region ScheduleCalendarFilters

  @Action(LoadScheduleCalendarFilterList)
  loadScheduleCalendarFilterList(
    ctx: StateContext<CalendarScheduleStateModel>,
  ) {
    ctx.dispatch([
      new LoadScheduleCalendarFilterCompanies(),
      new LoadScheduleCalendarFilterServices(),
      new LoadScheduleCalendarFilterSites(),
      new LoadScheduleCalendarFilterStatuses(),
    ]);
  }

  @Action(LoadScheduleCalendarFilterCompanies)
  loadScheduleCalendarFilterCompanies(
    ctx: StateContext<CalendarScheduleStateModel>,
  ) {
    const { filterServices, filterSites, filterStatuses } = ctx.getState();

    return this.getScheduleCalendarFilterCompanies(
      filterServices,
      filterSites,
      filterStatuses,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadScheduleCalendarFilterCompaniesSuccess(
            CalendarScheduleMapperService.mapToScheduleCalendarFilterList(data),
          ),
        );
      }),
    );
  }

  @Action(LoadScheduleCalendarFilterCompaniesSuccess)
  loadScheduleCalendarFilterCompaniesSuccess(
    ctx: StateContext<CalendarScheduleStateModel>,
    { dataCompanies }: LoadScheduleCalendarFilterCompaniesSuccess,
  ) {
    ctx.patchState({
      dataCompanies,
    });
  }

  @Action(LoadScheduleCalendarFilterServices)
  loadScheduleCalendarFilterServices(
    ctx: StateContext<CalendarScheduleStateModel>,
  ) {
    const { filterCompanies, filterSites, filterStatuses } = ctx.getState();

    return this.getScheduleCalendarFilterServices(
      filterCompanies,
      filterSites,
      filterStatuses,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadScheduleCalendarFilterServicesSuccess(
            CalendarScheduleMapperService.mapToScheduleCalendarFilterList(data),
          ),
        );
      }),
    );
  }

  @Action(LoadScheduleCalendarFilterServicesSuccess)
  loadScheduleCalendarFilterServicesSuccess(
    ctx: StateContext<CalendarScheduleStateModel>,
    { dataServices }: LoadScheduleCalendarFilterServicesSuccess,
  ) {
    ctx.patchState({
      dataServices,
    });
  }

  @Action(LoadScheduleCalendarFilterSites)
  loadScheduleCalendarFilterSites(
    ctx: StateContext<CalendarScheduleStateModel>,
  ) {
    const { filterCompanies, filterServices, filterStatuses } = ctx.getState();

    return this.getScheduleCalendarFilterSites(
      filterCompanies,
      filterServices,
      filterStatuses,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadScheduleCalendarFilterSitesSuccess(
            CalendarScheduleMapperService.mapToScheduleCalendarFilterTree(data),
          ),
        );
      }),
    );
  }

  @Action(LoadScheduleCalendarFilterSitesSuccess)
  loadScheduleCalendarFilterSitesSuccess(
    ctx: StateContext<CalendarScheduleStateModel>,
    { dataSites }: LoadScheduleCalendarFilterSitesSuccess,
  ) {
    ctx.patchState({
      dataSites,
    });
  }

  @Action(LoadScheduleCalendarFilterStatuses)
  loadScheduleCalendarFilterStatuses(
    ctx: StateContext<CalendarScheduleStateModel>,
  ) {
    const { filterCompanies, filterServices, filterSites } = ctx.getState();

    return this.getScheduleCalendarFilterStatuses(
      filterCompanies,
      filterServices,
      filterSites,
    ).pipe(
      tap((data) => {
        ctx.dispatch(
          new LoadScheduleCalendarFilterStatusesSuccess(
            CalendarScheduleMapperService.mapToScheduleCalendarFilterList(data),
          ),
        );
      }),
    );
  }

  @Action(LoadScheduleCalendarFilterStatusesSuccess)
  loadScheduleCalendarFilterStatusesSuccess(
    ctx: StateContext<CalendarScheduleStateModel>,
    { dataStatuses }: LoadScheduleCalendarFilterStatusesSuccess,
  ) {
    ctx.patchState({
      dataStatuses,
    });
  }

  @Action(UpdateScheduleCalendarFilterByKey)
  updateScheduleCalendarFilterByKey(
    ctx: StateContext<CalendarScheduleStateModel>,
    { data, key }: UpdateScheduleCalendarFilterByKey,
  ) {
    const actionsMap = {
      [ScheduleCalendarFilterTypes.Companies]: [
        new UpdateScheduleCalendarFilterCompanies(data as number[]),
        new LoadScheduleCalendarFilterServices(),
        new LoadScheduleCalendarFilterSites(),
        new LoadScheduleCalendarFilterStatuses(),
        new LoadCalendarSchedule(),
      ],
      [ScheduleCalendarFilterTypes.Services]: [
        new UpdateScheduleCalendarFilterServices(data as number[]),
        new LoadScheduleCalendarFilterCompanies(),
        new LoadScheduleCalendarFilterSites(),
        new LoadScheduleCalendarFilterStatuses(),
        new LoadCalendarSchedule(),
      ],
      [ScheduleCalendarFilterTypes.Sites]: [
        new UpdateScheduleCalendarFilterSites(
          data as SharedSelectTreeChangeEventOutput,
        ),
        new LoadScheduleCalendarFilterCompanies(),
        new LoadScheduleCalendarFilterServices(),
        new LoadScheduleCalendarFilterStatuses(),
        new LoadCalendarSchedule(),
      ],
      [ScheduleCalendarFilterTypes.Statuses]: [
        new UpdateScheduleCalendarFilterStatuses(data as number[]),
        new LoadScheduleCalendarFilterCompanies(),
        new LoadScheduleCalendarFilterServices(),
        new LoadScheduleCalendarFilterSites(),
        new LoadCalendarSchedule(),
      ],
    };

    ctx.dispatch(actionsMap[key]);
  }

  @Action(UpdateScheduleCalendarFilterCompanies)
  updateScheduleCalendarFilterCompanies(
    ctx: StateContext<CalendarScheduleStateModel>,
    { data }: UpdateScheduleCalendarFilterCompanies,
  ) {
    ctx.patchState({
      filterCompanies: data,
    });
  }

  @Action(UpdateScheduleCalendarFilterServices)
  updateScheduleCalendarFilterServices(
    ctx: StateContext<CalendarScheduleStateModel>,
    { data }: UpdateScheduleCalendarFilterServices,
  ) {
    ctx.patchState({
      filterServices: data,
    });
  }

  @Action(UpdateScheduleCalendarFilterSites)
  updateScheduleCalendarFilterSites(
    ctx: StateContext<CalendarScheduleStateModel>,
    { data }: UpdateScheduleCalendarFilterSites,
  ) {
    ctx.patchState({
      filterSites: data.filter as number[],
      prefillSites: data.prefill,
    });
  }

  @Action(UpdateScheduleCalendarFilterStatuses)
  updateScheduleCalendarFilterStatuses(
    ctx: StateContext<CalendarScheduleStateModel>,
    { data }: UpdateScheduleCalendarFilterStatuses,
  ) {
    ctx.patchState({
      filterStatuses: data,
    });
  }

  // #endregion ScheduleCalendarFilters

  private getScheduleCalendarFilterCompanies(
    services: number[],
    sites: number[],
    statuses: number[],
  ) {
    return this.calendarScheduleService
      .getScheduleCalendarFilterCompanies(services, sites, statuses)
      .pipe(
        map((dto: ScheduleCalendarFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getScheduleCalendarFilterServices(
    companies: number[],
    sites: number[],
    statuses: number[],
  ) {
    return this.calendarScheduleService
      .getScheduleCalendarFilterServices(companies, sites, statuses)
      .pipe(
        map((dto: ScheduleCalendarFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getScheduleCalendarFilterSites(
    companies: number[],
    services: number[],
    statuses: number[],
  ) {
    return this.calendarScheduleService
      .getScheduleCalendarFilterSites(companies, services, statuses)
      .pipe(
        map((dto: ScheduleCalendarFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getScheduleCalendarFilterStatuses(
    companies: number[],
    services: number[],
    sites: number[],
  ) {
    return this.calendarScheduleService
      .getScheduleCalendarFilterStatuses(companies, services, sites)
      .pipe(
        map((dto: ScheduleCalendarFilterDto) =>
          dto?.isSuccess && dto?.data ? dto.data : [],
        ),
      );
  }

  private getCalendarScheduleParams(
    state: CalendarScheduleStateModel,
    params?: CalendarScheduleParams,
  ): CalendarSchedulePayloadDto {
    const month = params?.month ?? state.month;
    const year = params?.year || state.year;
    const { filterCompanies, filterServices, filterSites, filterStatuses } =
      state;

    return {
      ...(month > 0 && { month }),
      year,
      ...(filterCompanies?.length && {
        companies: filterCompanies,
      }),
      ...(filterServices?.length && {
        services: filterServices,
      }),
      ...(filterSites?.length && {
        sites: filterSites,
      }),
      ...(filterStatuses?.length && {
        statuses: filterStatuses,
      }),
    };
  }
}

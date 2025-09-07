import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared';

import {
  CalendarScheduleState,
  CalendarScheduleStateModel,
} from '../calendar-schedule.state';

export class ScheduleCalendarFilterSelectors {
  @Selector([ScheduleCalendarFilterSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([ScheduleCalendarFilterSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([ScheduleCalendarFilterSelectors._dataSites])
  static dataSites(dataSites: TreeNode[]): TreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([ScheduleCalendarFilterSelectors._dataStatuses])
  static dataStatuses(
    dataStatuses: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataStatuses;
  }

  @Selector([ScheduleCalendarFilterSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([ScheduleCalendarFilterSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([ScheduleCalendarFilterSelectors._filterSites])
  static filterSites(filterSites: number[]): number[] {
    return filterSites;
  }

  @Selector([ScheduleCalendarFilterSelectors._filterStatuses])
  static filterStatuses(filterStatuses: number[]): number[] {
    return filterStatuses;
  }

  @Selector([ScheduleCalendarFilterSelectors._prefillSites])
  static prefillSites(prefillSites: TreeNode[]): TreeNode[] {
    return structuredClone(prefillSites);
  }

  @Selector([CalendarScheduleState])
  private static _dataCompanies(
    state: CalendarScheduleStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCompanies;
  }

  @Selector([CalendarScheduleState])
  private static _dataServices(
    state: CalendarScheduleStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataServices;
  }

  @Selector([CalendarScheduleState])
  private static _dataSites(state: CalendarScheduleStateModel): TreeNode[] {
    return state?.dataSites;
  }

  @Selector([CalendarScheduleState])
  private static _dataStatuses(
    state: CalendarScheduleStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataStatuses;
  }

  @Selector([CalendarScheduleState])
  private static _filterCompanies(state: CalendarScheduleStateModel): number[] {
    return state?.filterCompanies;
  }

  @Selector([CalendarScheduleState])
  private static _filterServices(state: CalendarScheduleStateModel): number[] {
    return state?.filterServices;
  }

  @Selector([CalendarScheduleState])
  private static _filterSites(state: CalendarScheduleStateModel): number[] {
    return state?.filterSites;
  }

  @Selector([CalendarScheduleState])
  private static _filterStatuses(state: CalendarScheduleStateModel): number[] {
    return state?.filterStatuses;
  }

  @Selector([CalendarScheduleState])
  private static _prefillSites(state: CalendarScheduleStateModel): TreeNode[] {
    return state?.prefillSites;
  }
}

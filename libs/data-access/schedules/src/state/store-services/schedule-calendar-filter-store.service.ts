import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { ScheduleCalendarFilterKey } from '../../models';
import {
  LoadScheduleCalendarFilterCompanies,
  LoadScheduleCalendarFilterList,
  LoadScheduleCalendarFilterServices,
  LoadScheduleCalendarFilterSites,
  LoadScheduleCalendarFilterStatuses,
  UpdateScheduleCalendarFilterByKey,
  UpdateScheduleCalendarFilterCompanies,
  UpdateScheduleCalendarFilterServices,
  UpdateScheduleCalendarFilterSites,
  UpdateScheduleCalendarFilterStatuses,
} from '../actions';
import { ScheduleCalendarFilterSelectors } from '../selectors';

@Injectable()
export class ScheduleCalendarFilterStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.dataCompanies,
    );
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.dataServices,
    );
  }

  get dataSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(ScheduleCalendarFilterSelectors.dataSites);
  }

  get dataStatuses(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.dataStatuses,
    );
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.filterCompanies,
    );
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.filterServices,
    );
  }

  get filterSites(): Signal<number[]> {
    return this.store.selectSignal(ScheduleCalendarFilterSelectors.filterSites);
  }

  get filterStatuses(): Signal<number[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.filterStatuses,
    );
  }

  get prefillSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(
      ScheduleCalendarFilterSelectors.prefillSites,
    );
  }

  @Dispatch()
  loadScheduleCalendarFilterList = () => new LoadScheduleCalendarFilterList();

  @Dispatch()
  loadScheduleCalendarFilterCompanies = () =>
    new LoadScheduleCalendarFilterCompanies();

  @Dispatch()
  loadScheduleCalendarFilterServices = () =>
    new LoadScheduleCalendarFilterServices();

  @Dispatch()
  loadScheduleCalendarFilterSites = () => new LoadScheduleCalendarFilterSites();

  @Dispatch()
  loadScheduleCalendarFilterStatuses = () =>
    new LoadScheduleCalendarFilterStatuses();

  @Dispatch()
  updateScheduleCalendarFilterByKey = (
    data: unknown,
    key: ScheduleCalendarFilterKey,
  ) => new UpdateScheduleCalendarFilterByKey(data, key);

  @Dispatch()
  updateScheduleCalendarFilterCompanies = (data: number[]) =>
    new UpdateScheduleCalendarFilterCompanies(data);

  @Dispatch()
  updateScheduleCalendarFilterServices = (data: number[]) =>
    new UpdateScheduleCalendarFilterServices(data);

  @Dispatch()
  updateScheduleCalendarFilterSites = (
    data: SharedSelectTreeChangeEventOutput,
  ) => new UpdateScheduleCalendarFilterSites(data);

  @Dispatch()
  updateScheduleCalendarFilterStatuses = (data: number[]) =>
    new UpdateScheduleCalendarFilterStatuses(data);
}

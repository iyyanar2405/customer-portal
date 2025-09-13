import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { FindingChartFilterKey } from '../../constants';
import {
  LoadFindingChartFilterCompanies,
  LoadFindingChartFilterList,
  LoadFindingChartFilterServices,
  LoadFindingChartFilterSites,
  UpdateFindingChartFilterByKey,
  UpdateFindingChartFilterCompanies,
  UpdateFindingChartFilterServices,
  UpdateFindingChartFilterSites,
  UpdateFindingChartFilterTimeRange,
} from '../actions';
import { FindingChartFilterSelectors } from '../selectors';

@Injectable()
export class FindingChartFilterStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.dataServices);
  }

  get dataSites(): Signal<any[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.dataSites);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.filterCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.filterServices);
  }

  get filterDateRange(): Signal<Date[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.filterDateRange);
  }

  get prefillSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(FindingChartFilterSelectors.prefillSites);
  }

  @Dispatch()
  loadFindingChartFilterList = () => new LoadFindingChartFilterList();

  @Dispatch()
  loadFindingChartFilterCompanies = () => new LoadFindingChartFilterCompanies();

  @Dispatch()
  loadFindingChartFilterServices = () => new LoadFindingChartFilterServices();

  @Dispatch()
  loadFindingChartFilterSites = () => new LoadFindingChartFilterSites();

  @Dispatch()
  updateFindingChartFilterByKey = (data: unknown, key: FindingChartFilterKey) =>
    new UpdateFindingChartFilterByKey(data, key);

  @Dispatch()
  updateFindingChartFilterCompanies = (data: number[]) =>
    new UpdateFindingChartFilterCompanies(data);

  @Dispatch()
  updateFindingChartFilterServices = (data: number[]) =>
    new UpdateFindingChartFilterServices(data);

  @Dispatch()
  updateFindingChartFilterSites = (data: SharedSelectTreeChangeEventOutput) =>
    new UpdateFindingChartFilterSites(data);

  @Dispatch()
  updateFindingChartFilterTimeRange = (data: Date[]) =>
    new UpdateFindingChartFilterTimeRange(data);
}

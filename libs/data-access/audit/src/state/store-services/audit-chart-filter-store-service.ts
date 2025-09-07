import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { AuditChartFilterKey } from '../../constants';
import {
  LoadAuditChartFilterCompanies,
  LoadAuditChartFilterList,
  LoadAuditChartFilterServices,
  LoadAuditChartFilterSites,
  UpdateAuditChartFilterByKey,
  UpdateAuditChartFilterCompanies,
  UpdateAuditChartFilterServices,
  UpdateAuditChartFilterSites,
  UpdateAuditChartFilterTimeRange,
} from '../actions';
import { AuditChartFilterSelectors } from '../selectors';

@Injectable()
export class AuditChartFilterStoreService {
  constructor(private store: Store) {}

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.dataServices);
  }

  get dataSites(): Signal<any[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.dataSites);
  }

  get filterCompanies(): Signal<number[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.filterCompanies);
  }

  get filterServices(): Signal<number[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.filterServices);
  }

  get prefillSites(): Signal<TreeNode[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.prefillSites);
  }

  get filterDateRange(): Signal<Date[]> {
    return this.store.selectSignal(AuditChartFilterSelectors.filterDateRange);
  }

  @Dispatch()
  loadAuditChartFilterList = () => new LoadAuditChartFilterList();

  @Dispatch()
  loadAuditChartFilterCompanies = () => new LoadAuditChartFilterCompanies();

  @Dispatch()
  loadAuditChartFilterServices = () => new LoadAuditChartFilterServices();

  @Dispatch()
  loadAuditChartFilterSites = () => new LoadAuditChartFilterSites();

  @Dispatch()
  updateAuditChartFilterByKey = (data: unknown, key: AuditChartFilterKey) =>
    new UpdateAuditChartFilterByKey(data, key);

  @Dispatch()
  updateAuditChartFilterCompanies = (data: number[]) =>
    new UpdateAuditChartFilterCompanies(data);

  @Dispatch()
  updateAuditChartFilterServices = (data: number[]) =>
    new UpdateAuditChartFilterServices(data);

  @Dispatch()
  updateAuditChartFilterSites = (data: SharedSelectTreeChangeEventOutput) =>
    new UpdateAuditChartFilterSites(data);

  @Dispatch()
  updateAuditChartFilterTimeRange = (data: Date[]) =>
    new UpdateAuditChartFilterTimeRange(data);
}

import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import {
  BarChartModel,
  DoughnutChartModel,
  FilterValue,
  IndividualFilter,
  SharedSelectMultipleDatum,
} from '@customer-portal/shared';

import { AuditChartsTabs, AuditGraphsFilterType } from '../../constants';
import {
  LoadAuditDaysBarGraphData,
  LoadAuditDaysDoughnutGraphData,
  LoadAuditGraphsFilterCompanies,
  LoadAuditGraphsFilterServices,
  LoadAuditGraphsFilterSites,
  LoadAuditsGraphsData,
  LoadAuditStatusBarGraphData,
  LoadAuditStatusDoughnutGraphData,
  NavigateFromChartToListView,
  NavigateFromTreeToListView,
  ResetAuditsGraphsData,
  ResetAuditsGraphState,
  SetActiveAuditsTab,
  UpdateAuditGraphsFilterByKey,
} from '../actions';
import { AuditGraphsSelectors } from '../selectors';

@Injectable()
export class AuditChartsStoreService {
  constructor(private store: Store) {}

  get auditsStatusDoughnutGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      AuditGraphsSelectors.auditStatusDoughnutGraphData,
    );
  }

  get auditStatusBarGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      AuditGraphsSelectors.auditStatusBarGraphData,
    );
  }

  get auditsDaysDoughnutGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      AuditGraphsSelectors.auditDaysDoughnutGraphData,
    );
  }

  get auditDaysBarGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(AuditGraphsSelectors.auditDaysBarGraphData);
  }

  get dataCompanies(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(AuditGraphsSelectors.dataCompanies);
  }

  get dataServices(): Signal<SharedSelectMultipleDatum<number>[]> {
    return this.store.selectSignal(AuditGraphsSelectors.dataServices);
  }

  get dataSites(): Signal<any[]> {
    return this.store.selectSignal(AuditGraphsSelectors.dataSites);
  }

  get auditDaysGridData(): Signal<TreeNode[]> {
    return this.store.selectSignal(AuditGraphsSelectors.auditDaysGridData);
  }

  @Dispatch()
  setActiveAuditsTab = (activeTab: AuditChartsTabs) =>
    new SetActiveAuditsTab(activeTab);

  @Dispatch()
  loadAuditsGraphsData = () => new LoadAuditsGraphsData();

  @Dispatch()
  loadAuditStatusDoughnutGraphData = () =>
    new LoadAuditStatusDoughnutGraphData();

  @Dispatch()
  loadAuditStatusBarGraphData = () => new LoadAuditStatusBarGraphData();

  @Dispatch()
  loadAuditDaysDoughnutGraphData = () => new LoadAuditDaysDoughnutGraphData();

  @Dispatch()
  loadAuditDaysBarGraphData = () => new LoadAuditDaysBarGraphData();

  @Dispatch()
  resetAuditsGraphState = () => new ResetAuditsGraphState();

  @Dispatch()
  resetAuditsGraphsData = () => new ResetAuditsGraphsData();

  @Dispatch()
  loadAuditGraphsFilterCompanies = () => new LoadAuditGraphsFilterCompanies();

  @Dispatch()
  loadAuditGraphsFilterServices = () => new LoadAuditGraphsFilterServices();

  @Dispatch()
  loadAuditGraphsFilterSites = () => new LoadAuditGraphsFilterSites();

  @Dispatch()
  updateAuditGraphsFilterByKey = (
    data: Date[] | number[],
    key: AuditGraphsFilterType,
  ) => new UpdateAuditGraphsFilterByKey(data, key);

  @Dispatch()
  navigateFromChartToListView = (filters: FilterValue[]) =>
    new NavigateFromChartToListView(filters);

  @Dispatch()
  navigateFromTreeToListView = (filterValue: IndividualFilter) =>
    new NavigateFromTreeToListView(filterValue);
}

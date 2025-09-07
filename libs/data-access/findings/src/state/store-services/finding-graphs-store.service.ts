import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TreeNode } from 'primeng/api';

import {
  BarChartModel,
  DoughnutChartModel,
  FilterValue,
  TreeColumnDefinition,
} from '@customer-portal/shared';

import {
  FindingTabs,
  FindingTrendsGraphModel,
  OpenFindingsResponse,
} from '../../models';
import {
  LoadFindingsByClauseList,
  LoadFindingsByStatusGraphData,
  LoadFindingsDataTrends,
  LoadFindingsGraphsData,
  LoadFindingStatusByCategoryGraphData,
  LoadFindingsTrendsGraphData,
  LoadOpenFindingsGraphData,
  NavigateFromChartToListView,
  NavigateFromTreeTableToListView,
  ResetFindingsGraphData,
  ResetFindingsGraphsState,
  SetActiveFindingsTab,
  UpdateOpenFindingsResponse,
} from '../actions';
import { FindingGraphsSelectors } from '../selectors';

@Injectable()
export class FindingGraphsStoreService {
  constructor(private store: Store) {}

  get findingsByStatusGraphData(): Signal<DoughnutChartModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingsByStatusGraphData,
    );
  }

  get findingStatusByCategoryGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingStatusByCategoryGraphData,
    );
  }

  get overdueFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.overdueFindingsGraphData,
    );
  }

  get becomingOverdueFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.becomingOverdueFindingsGraphData,
    );
  }

  get inProgressFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.inProgressFindingsGraphData,
    );
  }

  get earlyStageFindingsGraphData(): Signal<BarChartModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.earlyStageFindingsGraphData,
    );
  }

  get findingsTrendsGraphData(): Signal<FindingTrendsGraphModel> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingsTrendsGraphData,
    );
  }

  get findingsTrendsData(): Signal<TreeNode[]> {
    return this.store.selectSignal(FindingGraphsSelectors.findingsTrendsData);
  }

  get findingsTrendsColumns(): Signal<TreeColumnDefinition[]> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingsTrendsColumns,
    );
  }

  get findingsTrendsGradient(): Signal<Map<number, string>> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingsTrendsGradient,
    );
  }

  get findingsByClauseList(): Signal<TreeNode[]> {
    return this.store.selectSignal(FindingGraphsSelectors.findingsByClauseList);
  }

  get findingsByClauseListGradient(): Signal<{
    [key: string]: Map<number, string>;
  }> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingsByClauseListGradient,
    );
  }

  get findingsBySiteList(): Signal<TreeNode[]> {
    return this.store.selectSignal(FindingGraphsSelectors.findingsBySiteList);
  }

  get findingsBySiteListGradient(): Signal<{
    [key: string]: Map<number, string>;
  }> {
    return this.store.selectSignal(
      FindingGraphsSelectors.findingsBySiteListGradient,
    );
  }

  @Dispatch()
  setActiveFindingsTab = (activeTab: FindingTabs) =>
    new SetActiveFindingsTab(activeTab);

  @Dispatch()
  loadFindingsGraphsData = () => new LoadFindingsGraphsData();

  @Dispatch()
  loadFindingsByStatusGraphsData = () => new LoadFindingsByStatusGraphData();

  @Dispatch()
  loadFindingStatusByCategoryGraphData = () =>
    new LoadFindingStatusByCategoryGraphData();

  @Dispatch()
  loadOpenFindingsGraphData = () => new LoadOpenFindingsGraphData();

  @Dispatch()
  updateOpenFindingsResponse = (response: OpenFindingsResponse) =>
    new UpdateOpenFindingsResponse(response);

  @Dispatch()
  loadFindingsByCategoryGraphData = () => new LoadFindingsTrendsGraphData();

  @Dispatch()
  resetFindingsGraphData = () => new ResetFindingsGraphData();

  @Dispatch()
  resetFindingsGraphsState = () => new ResetFindingsGraphsState();

  @Dispatch()
  loadFindingsDataTrends = () => new LoadFindingsDataTrends();

  @Dispatch()
  navigateFromChartToListView = (filters: FilterValue[]) =>
    new NavigateFromChartToListView(filters);

  @Dispatch()
  navigateFromTreeTableToListView = (filters: FilterValue[]) =>
    new NavigateFromTreeTableToListView(filters);

  @Dispatch()
  loadFindingsByClauseList = () => new LoadFindingsByClauseList();
}

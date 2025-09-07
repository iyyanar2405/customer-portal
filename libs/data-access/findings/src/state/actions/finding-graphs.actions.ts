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

// #region FindingGraphState
export class ResetFindingsGraphsState {
  static readonly type = '[Finding Graphs] Reset Findings Graphs State';
}
// #endregion FindingGraphState

// #region FindingsActiveTab
export class SetActiveFindingsTab {
  static readonly type = '[Finding Graphs] Set Active Findings Tab';

  constructor(public activeTab: FindingTabs) {}
}

export class ResetFindingsGraphData {
  static readonly type = '[Finding Graphs] Reset Findings Graphs Data';
}
// #endregion FindingsActiveTab

// #region FindingGraphsData
export class LoadFindingsGraphsData {
  static readonly type = '[Finding Graphs] Load Findings Graphs Data';
}

// #endregion FindingGraphsData

// #region FindingStatusGraphs

export class LoadFindingsByStatusGraphData {
  static readonly type = '[Finding Graphs] Load Findings by Status Graph Data';
}

export class LoadFindingsByStatusGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load Findings by Status Graph Data Success';

  constructor(public findingsByStatusGraphData: DoughnutChartModel) {}
}

export class ResetFindingStatusGraphData {
  static readonly type = '[Finding Graphs] Reset Finding Status Graphs Data';
}

export class LoadFindingStatusByCategoryGraphData {
  static readonly type =
    '[Finding Graphs] Load Finding Status By Category Graph Data';
}

export class LoadFindingStatusByCategoryGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load Finding Status By Category Graph Data Success';

  constructor(public findingStatusByCategoryGraphData: BarChartModel) {}
}

// #endregion FindingStatusGraphs

// #region OpenFindingsGraphs
export class LoadOpenFindingsGraphData {
  static readonly type = '[Finding Graphs] Load Open Findings Graph Data';
}

export class LoadOverdueFindingsGraphData {
  static readonly type = '[Finding Graphs] Load Overdue Findings Graph Data';
}

export class LoadOverdueFindingsGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load Overdue Findings Graph Data Success';

  constructor(public overdueFindingsGraphData: BarChartModel) {}
}

export class LoadBecomingOverdueFindingsGraphData {
  static readonly type =
    '[Finding Graphs] Load Becoming Overdue Findings Graph Data';
}

export class LoadBecomingOverdueFindingsGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load Becoming Overdue Findings Graph Data Success';

  constructor(public becomingOverdueFindingsGraphData: BarChartModel) {}
}

export class LoadInProgressFindingsGraphData {
  static readonly type =
    '[Finding Graphs] Load In Progress Findings Graph Data';
}

export class LoadInProgressFindingsGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load In Progress Findings Graph Data Success';

  constructor(public inProgressFindingsGraphData: BarChartModel) {}
}
export class LoadEarlyStageFindingsGraphData {
  static readonly type =
    '[Finding Graphs] Load Early Stage Findings Graph Data';
}

export class LoadEarlyStageFindingsGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load Early Stage Findings Graph Data Success';

  constructor(public earlyStageFindingsGraphData: BarChartModel) {}
}

export class ResetOpenFindingsGraphData {
  static readonly type = '[Finding Graphs] Reset Open Graphs Data';
}

export class UpdateOpenFindingsResponse {
  static readonly type = '[Finding Graphs] Update Open Findings Response';

  constructor(public openFindingsResponse: OpenFindingsResponse) {}
}
// #endregion OpenFindingsGraphs

// #region FindingTrendsGraphs
export class LoadFindingsTrendsGraphData {
  static readonly type = '[Finding Graphs] Load Findings Trends Graph Data';
}

export class LoadFindingsTrendsGraphDataSuccess {
  static readonly type =
    '[Finding Graphs] Load Findings Trends Graph Data Success';

  constructor(public findingsTrendsGraphData: FindingTrendsGraphModel) {}
}

export class ResetFindingTrendsGraphData {
  static readonly type = '[Finding Graphs] Reset Finding Trends Graphs Data';
}

export class LoadFindingsDataTrends {
  static readonly type = '[Finding Graphs] Load Findings Data Trends';
}

export class LoadFindingsDataTrendsSuccess {
  static readonly type = '[Finding Graphs] Load Findings Data Trends Success';

  constructor(public data: any) {}
}

export class CreateFindingsDataTrendsColumns {
  static readonly type = '[Finding Graphs] Load Findings Data Trends Columns';

  constructor(public columns: TreeColumnDefinition[]) {}
}

export class CreateFindingsDataTrendsGradient {
  static readonly type = '[Finding Graphs] Load Findings Data Trends Gradient';

  constructor(public trendsGradient: any) {}
}

// #endregion FindingTrendsGraphs

// #region FindingsGraphsNavigation
export class NavigateFromChartToListView {
  static readonly type = '[Finding Graphs] Navigate From Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}

export class NavigateFromTreeTableToListView {
  static readonly type =
    '[Finding Graphs] Navigate From Tree Table To List View';

  constructor(public selectionValues: FilterValue[]) {}
}
// #endregion FindingsGraphsNavigation

// #region FindingsByClause

export class LoadFindingsByClauseList {
  static readonly type = '[Finding Graphs] Load Findings By Clause Data';
}

export class LoadFindingsByClauseListSuccess {
  static readonly type =
    '[Finding Graphs] Load Findings By Clause Data Success';

  constructor(public data: TreeNode[]) {}
}

export class CreateFindingsByClauseDataGradient {
  static readonly type =
    '[Finding Graphs] Create Findings By Clause Data Gradient';

  constructor(public gradient: { [key: string]: Map<number, string> }) {}
}

export class ResetFindingsByClauseList {
  static readonly type = '[Finding Graphs] Reset Findings By Clause List';
}

// #endregion FindingsByClause

// #region FindingsBySite

export class LoadFindingsBySiteList {
  static readonly type = '[Finding Graphs] Load Findings By Site Data';
}

export class LoadFindingsBySiteListSuccess {
  static readonly type = '[Finding Graphs] Load Findings By Site Data Success';

  constructor(public data: TreeNode[]) {}
}

export class CreateFindingsBySiteListGradient {
  static readonly type =
    '[Finding Graphs] Create Findings By Clause Data Gradient';

  constructor(public gradient: { [key: string]: Map<number, string> }) {}
}

export class ResetFindingsBySiteList {
  static readonly type = '[Finding Graphs] Reset Findings By Site List';
}
// #endregion FindingsBySite

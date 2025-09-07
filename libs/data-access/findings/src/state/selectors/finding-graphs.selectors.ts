import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import {
  BarChartModel,
  DoughnutChartModel,
  TreeColumnDefinition,
} from '@customer-portal/shared';

import { FindingTrendsGraphModel } from '../../models';
import {
  FindingGraphsState,
  FindingGraphsStateModel,
} from '../finding-graphs.state';

export class FindingGraphsSelectors {
  @Selector([FindingGraphsSelectors._findingsByStatusGraphData])
  static findingsByStatusGraphData(
    findingsByStatusGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return findingsByStatusGraphData;
  }

  @Selector([FindingGraphsSelectors._findingStatusByCategoryGraphData])
  static findingStatusByCategoryGraphData(
    findingStatusByCategoryGraphData: BarChartModel,
  ): BarChartModel {
    return findingStatusByCategoryGraphData;
  }

  @Selector([FindingGraphsSelectors._overdueFindingsGraphData])
  static overdueFindingsGraphData(
    overdueFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return overdueFindingsGraphData;
  }

  @Selector([FindingGraphsSelectors._becomingOverdueFindingsGraphData])
  static becomingOverdueFindingsGraphData(
    becomingOverdueFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return becomingOverdueFindingsGraphData;
  }

  @Selector([FindingGraphsSelectors._inProgressFindingsGraphData])
  static inProgressFindingsGraphData(
    inProgressFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return inProgressFindingsGraphData;
  }

  @Selector([FindingGraphsSelectors._earlyStageFindingsGraphData])
  static earlyStageFindingsGraphData(
    earlyStageFindingsGraphData: BarChartModel,
  ): BarChartModel {
    return earlyStageFindingsGraphData;
  }

  @Selector([FindingGraphsSelectors._findingsTrendsGraphData])
  static findingsTrendsGraphData(
    findingsTrendsGraphData: FindingTrendsGraphModel,
  ): FindingTrendsGraphModel {
    return findingsTrendsGraphData;
  }

  @Selector([FindingGraphsSelectors._findingsTrendsData])
  static findingsTrendsData(findingsTrendsData: TreeNode[]): TreeNode[] {
    return findingsTrendsData;
  }

  @Selector([FindingGraphsSelectors._findingsTrendsColumns])
  static findingsTrendsColumns(
    findingsTrendsColumns: TreeColumnDefinition[],
  ): TreeColumnDefinition[] {
    return findingsTrendsColumns;
  }

  @Selector([FindingGraphsSelectors._findingsTrendsGradient])
  static findingsTrendsGradient(findingsTrendsGradient: any): any {
    return findingsTrendsGradient;
  }

  @Selector([FindingGraphsSelectors._findingsByClauseList])
  static findingsByClauseList(findingsByClauseList: TreeNode[]): TreeNode[] {
    return findingsByClauseList;
  }

  @Selector([FindingGraphsSelectors._findingsByClauseListGradient])
  static findingsByClauseListGradient(findingsByClauseListGradient: {
    [key: string]: Map<number, string>;
  }) {
    return findingsByClauseListGradient;
  }

  @Selector([FindingGraphsSelectors._findingsBySiteList])
  static findingsBySiteList(findingsBySiteList: TreeNode[]): TreeNode[] {
    return findingsBySiteList;
  }

  @Selector([FindingGraphsSelectors._findingsBySiteListGradient])
  static findingsBySiteListGradient(findingsBySiteListGradient: {
    [key: string]: Map<number, string>;
  }) {
    return findingsBySiteListGradient;
  }

  @Selector([FindingGraphsState])
  private static _findingsByStatusGraphData(
    state: FindingGraphsStateModel,
  ): DoughnutChartModel {
    return state?.findingsByStatusGraphData;
  }

  @Selector([FindingGraphsState])
  private static _findingStatusByCategoryGraphData(
    state: FindingGraphsStateModel,
  ): BarChartModel {
    return state.findingStatusByCategoryGraphData;
  }

  @Selector([FindingGraphsState])
  private static _overdueFindingsGraphData(
    state: FindingGraphsStateModel,
  ): BarChartModel {
    return state.overdueFindingsGraphData;
  }

  @Selector([FindingGraphsState])
  private static _becomingOverdueFindingsGraphData(
    state: FindingGraphsStateModel,
  ): BarChartModel {
    return state.becomingOverdueFindingsGraphData;
  }

  @Selector([FindingGraphsState])
  private static _inProgressFindingsGraphData(
    state: FindingGraphsStateModel,
  ): BarChartModel {
    return state.inProgressFindingsGraphData;
  }

  @Selector([FindingGraphsState])
  private static _earlyStageFindingsGraphData(
    state: FindingGraphsStateModel,
  ): BarChartModel {
    return state.earlyStageFindingsGraphData;
  }

  @Selector([FindingGraphsState])
  private static _findingsTrendsGraphData(
    state: FindingGraphsStateModel,
  ): FindingTrendsGraphModel {
    return state?.findingsTrendsGraphData;
  }

  @Selector([FindingGraphsState])
  private static _findingsTrendsData(
    state: FindingGraphsStateModel,
  ): TreeNode[] {
    return state?.findingsTrendsData ?? [];
  }

  @Selector([FindingGraphsState])
  private static _findingsTrendsColumns(
    state: FindingGraphsStateModel,
  ): TreeColumnDefinition[] {
    return state?.findingsTrendsColumns ?? [];
  }

  @Selector([FindingGraphsState])
  private static _findingsTrendsGradient(state: FindingGraphsStateModel): any {
    return state?.findingsTrendsGradient ?? [];
  }

  @Selector([FindingGraphsState])
  private static _findingsByClauseList(
    state: FindingGraphsStateModel,
  ): TreeNode[] {
    return state?.findingsByClauseList ?? [];
  }

  @Selector([FindingGraphsState])
  private static _findingsByClauseListGradient(
    state: FindingGraphsStateModel,
  ): { [key: string]: Map<number, string> } {
    return state?.findingsByClauseListGradient ?? {};
  }

  @Selector([FindingGraphsState])
  private static _findingsBySiteList(
    state: FindingGraphsStateModel,
  ): TreeNode[] {
    return state?.findingsBySiteList ?? [];
  }

  @Selector([FindingGraphsState])
  private static _findingsBySiteListGradient(state: FindingGraphsStateModel): {
    [key: string]: Map<number, string>;
  } {
    return state?.findingsBySiteListGradient ?? {};
  }
}

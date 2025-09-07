import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared';

import {
  FindingGraphsState,
  FindingGraphsStateModel,
} from '../finding-graphs.state';

export class FindingChartFilterSelectors {
  @Selector([FindingChartFilterSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([FindingChartFilterSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([FindingChartFilterSelectors._dataSites])
  static dataSites(dataSites: TreeNode[]): TreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([FindingChartFilterSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([FindingChartFilterSelectors._filterDateRange])
  static filterDateRange(filterDateRange: Date[]): Date[] {
    return filterDateRange;
  }

  @Selector([FindingChartFilterSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([FindingChartFilterSelectors._prefillSites])
  static prefillSites(prefillSites: TreeNode[]): TreeNode[] {
    return prefillSites;
  }

  @Selector([FindingGraphsState])
  private static _dataCompanies(
    state: FindingGraphsStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCompanies;
  }

  @Selector([FindingGraphsState])
  private static _dataServices(
    state: FindingGraphsStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataServices;
  }

  @Selector([FindingGraphsState])
  private static _dataSites(state: FindingGraphsStateModel): TreeNode[] {
    return state?.dataSites;
  }

  @Selector([FindingGraphsState])
  private static _filterCompanies(state: FindingGraphsStateModel): number[] {
    return state?.filterCompanies;
  }

  @Selector([FindingGraphsState])
  private static _filterDateRange(state: FindingGraphsStateModel): Date[] {
    return [state?.filterStartDate, state?.filterEndDate];
  }

  @Selector([FindingGraphsState])
  private static _filterServices(state: FindingGraphsStateModel): number[] {
    return state?.filterServices;
  }

  @Selector([FindingGraphsState])
  private static _prefillSites(state: FindingGraphsStateModel): TreeNode[] {
    return state?.prefillSites;
  }
}

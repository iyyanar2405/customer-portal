import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import { SharedSelectMultipleDatum } from '@customer-portal/shared';

import { AuditGraphsState, AuditGraphsStateModel } from '../audit-graphs.state';

export class AuditChartFilterSelectors {
  @Selector([AuditChartFilterSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([AuditChartFilterSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([AuditChartFilterSelectors._dataSites])
  static dataSites(dataSites: TreeNode[]): TreeNode[] {
    return structuredClone(dataSites);
  }

  @Selector([AuditChartFilterSelectors._filterCompanies])
  static filterCompanies(filterCompanies: number[]): number[] {
    return filterCompanies;
  }

  @Selector([AuditChartFilterSelectors._filterServices])
  static filterServices(filterServices: number[]): number[] {
    return filterServices;
  }

  @Selector([AuditChartFilterSelectors._prefillSites])
  static prefillSites(prefillSites: TreeNode[]): TreeNode[] {
    return prefillSites;
  }

  @Selector([AuditChartFilterSelectors._filterDateRange])
  static filterDateRange(filterDateRange: Date[]): Date[] {
    return filterDateRange;
  }

  @Selector([AuditGraphsState])
  private static _dataCompanies(
    state: AuditGraphsStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataCompanies;
  }

  @Selector([AuditGraphsState])
  private static _dataServices(
    state: AuditGraphsStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state?.dataServices;
  }

  @Selector([AuditGraphsState])
  private static _dataSites(state: AuditGraphsStateModel): TreeNode[] {
    return state?.dataSites;
  }

  @Selector([AuditGraphsState])
  private static _filterCompanies(state: AuditGraphsStateModel): number[] {
    return state?.filterCompanies;
  }

  @Selector([AuditGraphsState])
  private static _filterServices(state: AuditGraphsStateModel): number[] {
    return state?.filterServices;
  }

  @Selector([AuditGraphsState])
  private static _prefillSites(state: AuditGraphsStateModel): TreeNode[] {
    return state?.prefillSites;
  }

  @Selector([AuditGraphsState])
  private static _filterDateRange(state: AuditGraphsStateModel): Date[] {
    return [state?.filterStartDate, state?.filterEndDate];
  }
}

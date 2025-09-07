import { Selector } from '@ngxs/store';
import { TreeNode } from 'primeng/api';

import {
  BarChartModel,
  DoughnutChartModel,
  SharedSelectMultipleDatum,
} from '@customer-portal/shared';

import { AuditGraphsState, AuditGraphsStateModel } from '../audit-graphs.state';

export class AuditGraphsSelectors {
  @Selector([AuditGraphsSelectors._dataCompanies])
  static dataCompanies(
    dataCompanies: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataCompanies;
  }

  @Selector([AuditGraphsSelectors._dataServices])
  static dataServices(
    dataServices: SharedSelectMultipleDatum<number>[],
  ): SharedSelectMultipleDatum<number>[] {
    return dataServices;
  }

  @Selector([AuditGraphsSelectors._dataSites])
  static dataSites(dataSites: any[]): any[] {
    return dataSites;
  }

  @Selector([AuditGraphsSelectors._auditStatusDoughnutGraphData])
  static auditStatusDoughnutGraphData(
    auditStatusDoughnutGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return auditStatusDoughnutGraphData;
  }

  @Selector([AuditGraphsSelectors._auditStatusBarGraphData])
  static auditStatusBarGraphData(
    auditStatusBarGraphData: BarChartModel,
  ): BarChartModel {
    return auditStatusBarGraphData;
  }

  @Selector([AuditGraphsSelectors._auditDaysDoughnutGraphData])
  static auditDaysDoughnutGraphData(
    auditDaysDoughnutGraphData: DoughnutChartModel,
  ): DoughnutChartModel {
    return auditDaysDoughnutGraphData;
  }

  @Selector([AuditGraphsSelectors._auditDaysBarGraphData])
  static auditDaysBarGraphData(
    auditDaysBarGraphData: BarChartModel,
  ): BarChartModel {
    return auditDaysBarGraphData;
  }

  @Selector([AuditGraphsSelectors._auditDaysGridData])
  static auditDaysGridData(auditDaysGridData: TreeNode[]): TreeNode[] {
    return auditDaysGridData;
  }

  @Selector([AuditGraphsState])
  private static _dataCompanies(
    state: AuditGraphsStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataCompanies;
  }

  @Selector([AuditGraphsState])
  private static _dataServices(
    state: AuditGraphsStateModel,
  ): SharedSelectMultipleDatum<number>[] {
    return state.dataServices;
  }

  @Selector([AuditGraphsState])
  private static _dataSites(state: AuditGraphsStateModel): any[] {
    return structuredClone(state.dataSites);
  }

  @Selector([AuditGraphsState])
  private static _auditStatusDoughnutGraphData(
    state: AuditGraphsStateModel,
  ): DoughnutChartModel {
    return state.auditStatusDoughnutGraphData;
  }

  @Selector([AuditGraphsState])
  private static _auditStatusBarGraphData(
    state: AuditGraphsStateModel,
  ): BarChartModel {
    return state.auditStatusBarGraphData;
  }

  @Selector([AuditGraphsState])
  private static _auditDaysDoughnutGraphData(
    state: AuditGraphsStateModel,
  ): DoughnutChartModel {
    return state.auditDaysDoughnutGraphData;
  }

  @Selector([AuditGraphsState])
  private static _auditDaysBarGraphData(
    state: AuditGraphsStateModel,
  ): BarChartModel {
    return state.auditDaysBarGraphData;
  }

  @Selector([AuditGraphsState])
  private static _auditDaysGridData(state: AuditGraphsStateModel): TreeNode[] {
    return state.auditDaysGridData;
  }
}

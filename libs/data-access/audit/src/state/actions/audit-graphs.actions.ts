import {
  BarChartModel,
  DoughnutChartModel,
  FilterValue,
  IndividualFilter,
  SharedSelectMultipleDatum,
} from '@customer-portal/shared';

import { AuditChartsTabs, AuditGraphsFilterType } from '../../constants';
import { AuditDaysGridModel } from '../../models';

// #region AuditGraphsState
export class ResetAuditsGraphState {
  static readonly type = '[Audit Graphs] Reset Audits Graphs State';
}

// #endregion AuditGraphsState

// #region AuditsActiveTab
export class SetActiveAuditsTab {
  static readonly type = '[Audit Graphs] Set Active Audits Tab';

  constructor(public activeTab: AuditChartsTabs) {}
}

export class ResetAuditsGraphsData {
  static readonly type = '[Audit Graphs] Reset Audits Graphs Data';
}

// #endregion AuditsActiveTab

// #region AuditsGraphsData
export class LoadAuditsGraphsData {
  static readonly type = '[Audit Graphs] Load Audits Graphs Data';
}

// #endregion AuditsGraphsData

// #region AuditStatusCharts
export class LoadAuditStatusDoughnutGraphData {
  static readonly type = '[Audit Graphs] Load Audit Status Doughnut Graph Data';
}

export class LoadAuditStatusDoughnutGraphDataSuccess {
  static readonly type =
    '[Audit Graphs] Load Audit Status Doughnut Graph Data Success';

  constructor(public auditStatusDoughnutGraphData: DoughnutChartModel) {}
}

export class LoadAuditStatusBarGraphData {
  static readonly type = '[Audit Graphs] Load Audit Status Bar Graph Data';
}

export class LoadAuditStatusBarGraphDataSuccess {
  static readonly type =
    '[Audit Graphs] Load Audit Status Bar Graph Data Success';

  constructor(public auditStatusBarGraphData: BarChartModel) {}
}

export class ResetAuditStatusChartsData {
  static readonly type = '[Audit Graphs] Reset Audits Status Charts Data';
}
// #endregion AuditStatusCharts

// #region AuditDaysCharts
export class LoadAuditDaysDoughnutGraphData {
  static readonly type = '[Audit Graphs] Load Audit Days Doughnut Graph Data';
}

export class LoadAuditDaysDoughnutGraphDataSuccess {
  static readonly type =
    '[Audit Graphs] Load Audit Days Doughnut Graph Data Success';

  constructor(public auditDaysDoughnutGraphData: DoughnutChartModel) {}
}

export class LoadAuditDaysBarGraphData {
  static readonly type = '[Audit Graphs] Load Audit Days Bar Graph Data';
}

export class LoadAuditDaysBarGraphDataSuccess {
  static readonly type =
    '[Audit Graphs] Load Audit Days Bar Graph Data Success';

  constructor(public auditDaysBarGraphData: BarChartModel) {}
}

export class ResetAuditDaysChartData {
  static readonly type = '[Audit Graphs] Reset Audits Days Charts Data';
}
// #endregion AuditDaysCharts

// #region AuditGraphFilters
export class LoadAuditGraphsFilterCompanies {
  static readonly type = '[Audit Graphs] Load Filter Companies';
}

export class LoadAuditGraphsFilterCompaniesSuccess {
  static readonly type = '[Audit Graphs] Load Filter Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadAuditGraphsFilterServices {
  static readonly type = '[Audit Graphs] Load Filter Services';
}

export class LoadAuditGraphsFilterServicesSuccess {
  static readonly type = '[Audit Graphs] Load Filter Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadAuditGraphsFilterSites {
  static readonly type = '[Audit Graphs] Load Filter Sites';
}

export class LoadAuditGraphsFilterSitesSuccess {
  static readonly type = '[Audit Graphs] Load Filter Sites Success';

  constructor(public dataSites: any[]) {}
}

export class UpdateAuditGraphsFilterByKey {
  static readonly type = '[Audit Graphs] Update Filter';

  constructor(
    public data: Date[] | number[],
    public key: AuditGraphsFilterType,
  ) {}
}

// #endregion AuditGraphFilters

// #region AuditDaysGridData
export class LoadAuditDaysGridData {
  static readonly type = '[Audit Graphs] Load Audit Days Grid Data';
}

export class LoadAuditDaysGridDataSuccess {
  static readonly type = '[Audit Graphs] Load Audit Days Grid Data Success';

  constructor(public auditDaysGridData: AuditDaysGridModel[]) {}
}

export class ResetAuditDaysGridData {
  static readonly type = '[Audit Graphs] Reset Audit Days Grid Data';
}
// #endregion AuditDaysGridData

// #region AuditGraphsNavigation
export class NavigateFromChartToListView {
  static readonly type = '[Audit Graphs] Navigate From Chart To List View';

  constructor(public tooltipFilters: FilterValue[]) {}
}

export class NavigateFromTreeToListView {
  static readonly type = '[Audit Graphs] Navigate From Tree To List View';

  constructor(public filterValue: IndividualFilter) {}
}
// #endregion AuditGraphsNavigation

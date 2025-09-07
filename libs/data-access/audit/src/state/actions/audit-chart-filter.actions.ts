import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { AuditChartFilterKey } from '../../constants';

export class LoadAuditChartFilterList {
  static readonly type = '[Audit Chart Filter] Load';
}

export class LoadAuditChartFilterCompanies {
  static readonly type = '[Audit Chart Filter] Load Companies';
}

export class LoadAuditChartFilterCompaniesSuccess {
  static readonly type = '[Audit Chart Filter] Load Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadAuditChartFilterServices {
  static readonly type = '[Audit Chart Filter] Load Services';
}

export class LoadAuditChartFilterServicesSuccess {
  static readonly type = '[Audit Chart Filter] Load Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadAuditChartFilterSites {
  static readonly type = '[Audit Chart Filter] Load Sites';
}

export class LoadAuditChartFilterSitesSuccess {
  static readonly type = '[Audit Chart Filter] Load Sites Success';

  constructor(public dataSites: any[]) {}
}

export class UpdateAuditChartFilterByKey {
  static readonly type = '[Audit Chart Filter] Update by Key';

  constructor(
    public data: unknown,
    public key: AuditChartFilterKey,
  ) {}
}

export class UpdateAuditChartFilterCompanies {
  static readonly type = '[Audit Chart Filter] Update Companies';

  constructor(public data: number[]) {}
}

export class UpdateAuditChartFilterServices {
  static readonly type = '[Audit Chart Filter] Update Services';

  constructor(public data: number[]) {}
}

export class UpdateAuditChartFilterSites {
  static readonly type = '[Audit Chart Filter] Update Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateAuditChartFilterTimeRange {
  static readonly type = '[Audit Chart Filter] Update Time Range';

  constructor(public data: Date[]) {}
}

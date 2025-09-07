import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { FindingChartFilterKey } from '../../constants';

export class LoadFindingChartFilterList {
  static readonly type = '[Finding Chart Filter] Load';
}

export class LoadFindingChartFilterCompanies {
  static readonly type = '[Finding Chart Filter] Load Companies';
}

export class LoadFindingChartFilterCompaniesSuccess {
  static readonly type = '[Finding Chart Filter] Load Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadFindingChartFilterServices {
  static readonly type = '[Finding Chart Filter] Load Services';
}

export class LoadFindingChartFilterServicesSuccess {
  static readonly type = '[Finding Chart Filter] Load Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadFindingChartFilterSites {
  static readonly type = '[Finding Chart Filter] Load Sites';
}

export class LoadFindingChartFilterSitesSuccess {
  static readonly type = '[Finding Chart Filter] Load Sites Success';

  constructor(public dataSites: any[]) {}
}

export class UpdateFindingChartFilterByKey {
  static readonly type = '[Finding Chart Filter] Update by Key';

  constructor(
    public data: unknown,
    public key: FindingChartFilterKey,
  ) {}
}

export class UpdateFindingChartFilterCompanies {
  static readonly type = '[Finding Chart Filter] Update Companies';

  constructor(public data: number[]) {}
}

export class UpdateFindingChartFilterServices {
  static readonly type = '[Finding Chart Filter] Update Services';

  constructor(public data: number[]) {}
}

export class UpdateFindingChartFilterSites {
  static readonly type = '[Finding Chart Filter] Update Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateFindingChartFilterTimeRange {
  static readonly type = '[Finding Chart Filter] Update Time Range';

  constructor(public data: Date[]) {}
}

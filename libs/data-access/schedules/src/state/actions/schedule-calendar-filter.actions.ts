import {
  SharedSelectMultipleDatum,
  SharedSelectTreeChangeEventOutput,
} from '@customer-portal/shared';

import { ScheduleCalendarFilterKey } from '../../models';

export class LoadScheduleCalendarFilterList {
  static readonly type = '[Schedule Calendar Filter] Load All';
}

export class LoadScheduleCalendarFilterCompanies {
  static readonly type = '[Schedule Calendar Filter] Load Companies';
}

export class LoadScheduleCalendarFilterCompaniesSuccess {
  static readonly type = '[Schedule Calendar Filter] Load Companies Success';

  constructor(public dataCompanies: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadScheduleCalendarFilterServices {
  static readonly type = '[Schedule Calendar Filter] Load Services';
}

export class LoadScheduleCalendarFilterServicesSuccess {
  static readonly type = '[Schedule Calendar Filter] Load Services Success';

  constructor(public dataServices: SharedSelectMultipleDatum<number>[]) {}
}

export class LoadScheduleCalendarFilterSites {
  static readonly type = '[Schedule Calendar Filter] Load Sites';
}

export class LoadScheduleCalendarFilterSitesSuccess {
  static readonly type = '[Schedule Calendar Filter] Load Sites Success';

  constructor(public dataSites: any[]) {}
}

export class LoadScheduleCalendarFilterStatuses {
  static readonly type = '[Schedule Calendar Filter] Load Statuses';
}

export class LoadScheduleCalendarFilterStatusesSuccess {
  static readonly type = '[Schedule Calendar Filter] Load Statuses Success';

  constructor(public dataStatuses: SharedSelectMultipleDatum<number>[]) {}
}

export class UpdateScheduleCalendarFilterCompanies {
  static readonly type = '[Schedule Calendar Filter] Update Companies';

  constructor(public data: number[]) {}
}

export class UpdateScheduleCalendarFilterServices {
  static readonly type = '[Schedule Calendar Filter] Update Services';

  constructor(public data: number[]) {}
}

export class UpdateScheduleCalendarFilterSites {
  static readonly type = '[Schedule Calendar Filter] Update Sites';

  constructor(public data: SharedSelectTreeChangeEventOutput) {}
}

export class UpdateScheduleCalendarFilterStatuses {
  static readonly type = '[Schedule Calendar Filter] Update Statuses';

  constructor(public data: number[]) {}
}

export class UpdateScheduleCalendarFilterByKey {
  static readonly type = '[Schedule Calendar Filter] Update by Key';

  constructor(
    public data: unknown,
    public key: ScheduleCalendarFilterKey,
  ) {}
}

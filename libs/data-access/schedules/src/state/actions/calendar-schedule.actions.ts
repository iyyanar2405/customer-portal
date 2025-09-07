import { CalendarScheduleModel, CalendarScheduleParams } from '../../models';

export class LoadCalendarSchedule {
  static readonly type = '[Calendar Schedule] Load Schedule';

  constructor(public params?: CalendarScheduleParams) {}
}

export class LoadCalendarScheduleSuccess {
  static readonly type = '[Calendar Schedule] Load Schedule Success';

  constructor(public calendarSchedule: CalendarScheduleModel[]) {}
}

export class UpdateCalendarScheduleMonth {
  static readonly type = '[Calendar Schedule] Update Month';

  constructor(public month: number) {}
}

export class UpdateCalendarScheduleYear {
  static readonly type = '[Calendar Schedule] Update Year';

  constructor(public year: number) {}
}

export class UpdateCalendarSchedulePreferenceSet {
  static readonly type = '[Calendar Schedule] Update Preference Token';

  constructor(public isPreferenceSet: boolean) {}
}

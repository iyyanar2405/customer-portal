import { Injectable, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { CalendarScheduleModel, CalendarScheduleParams } from '../../models';
import {
  LoadCalendarSchedule,
  UpdateCalendarSchedulePreferenceSet,
} from '../actions';
import { CalendarScheduleSelectors } from '../selectors';

@Injectable()
export class CalendarScheduleStoreService {
  constructor(private store: Store) {}

  get calendarSchedule(): Signal<CalendarScheduleModel[]> {
    return this.store.selectSignal(CalendarScheduleSelectors.calendarSchedule);
  }

  get calendarIsPreferenceSet(): Signal<boolean> {
    return this.store.selectSignal(
      CalendarScheduleSelectors.calendarIsPreferenceSet,
    );
  }

  @Dispatch()
  loadCalendarSchedule = (params?: CalendarScheduleParams) =>
    new LoadCalendarSchedule(params);

  @Dispatch()
  updateCalendarSchedulePreferenceSet = (isPreferenceSet: boolean) =>
    new UpdateCalendarSchedulePreferenceSet(isPreferenceSet);
}

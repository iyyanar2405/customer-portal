import { Selector } from '@ngxs/store';

import { CalendarScheduleModel } from '../../models';
import {
  CalendarScheduleState,
  CalendarScheduleStateModel,
} from '../calendar-schedule.state';

export class CalendarScheduleSelectors {
  @Selector([CalendarScheduleState])
  static calendarSchedule(
    state: CalendarScheduleStateModel,
  ): CalendarScheduleModel[] {
    return state.calendarSchedule;
  }

  @Selector([CalendarScheduleState])
  static calendarIsPreferenceSet(state: CalendarScheduleStateModel): boolean {
    return state.isPreferenceSet;
  }
}

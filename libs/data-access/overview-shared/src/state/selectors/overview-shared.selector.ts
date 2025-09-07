import { Selector } from '@ngxs/store';

import {
  OverviewSharedState,
  OverviewSharedStateModel,
} from '../overview-shared.state';

export class OverviewSharedSelectors {
  @Selector([OverviewSharedState])
  static getSelectedDate(state: OverviewSharedStateModel): Date | undefined {
    return state.auditCalendarSelectedDate;
  }
}

import { Selector } from '@ngxs/store';

import {
  OverviewUpcomingAuditEvent,
  OverviewUpcomingAuditsStateModel,
} from '../../models';
import { OverviewUpcomingAuditsState } from '../overview-upcoming-audit.state';

export class OverviewUpcomingAuditsSelectors {
  @Selector([OverviewUpcomingAuditsState])
  static getUpcomingAuditEvent(
    event: OverviewUpcomingAuditsStateModel,
  ): OverviewUpcomingAuditEvent[] {
    return event?.events || [];
  }
}

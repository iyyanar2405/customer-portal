import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  ScheduleCalendarInviteDto,
  ScheduleCalendarRescheduleReasonDto,
} from '../../../dtos';
import {
  SCHEDULE_CALENDAR_CONFIRM_MUTATION,
  SCHEDULE_CALENDAR_INVITE_QUERY,
  SCHEDULE_CALENDAR_RESCHEDULE_MUTATION,
  SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
} from '../../../graphql';

@Injectable({ providedIn: 'root' })
export class ScheduleCalendarActionService {
  private clientName = 'schedule';

  constructor(private readonly apollo: Apollo) {}

  getScheduleCalendarAddToCalendar(
    siteAuditId: number,
  ): Observable<ScheduleCalendarInviteDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: true,
          siteAuditId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.addToCalender));
  }

  getScheduleCalendarShareInvite(
    siteAuditId: number,
  ): Observable<ScheduleCalendarInviteDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_INVITE_QUERY,
        variables: {
          isAddToCalender: false,
          siteAuditId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((results: any) => results?.data?.addToCalender));
  }

  getScheduleCalendarRescheduleReasons(): Observable<ScheduleCalendarRescheduleReasonDto> {
    return this.apollo
      .use(this.clientName)
      .query({
        query: SCHEDULE_CALENDAR_RESCHEDULE_REASONS_QUERY,
      })
      .pipe(map((results: any) => results?.data?.reScheduleReasons));
  }

  editScheduleCalendarReschedule(
    additionalComments: string,
    rescheduleDate: Date,
    rescheduleReason: string,
    siteAuditId: number,
    weekNumber: string,
  ) {
    return this.apollo.use(this.clientName).mutate({
      mutation: SCHEDULE_CALENDAR_RESCHEDULE_MUTATION,
      variables: {
        additionalComments,
        rescheduleDate,
        rescheduleReason,
        siteAuditId,
        weekNumber,
      },
    });
  }

  editScheduleCalendarConfirm(siteAuditId: number) {
    return this.apollo.use(this.clientName).mutate({
      mutation: SCHEDULE_CALENDAR_CONFIRM_MUTATION,
      variables: {
        siteAuditId,
      },
    });
  }
}

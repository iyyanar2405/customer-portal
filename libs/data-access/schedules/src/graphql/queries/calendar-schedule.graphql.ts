import { gql } from 'apollo-angular';

export const CALENDAR_SCHEDULE_QUERY = gql`
  query GetAuditSchedulesForCalendar(
    $calendarScheduleFilter: CalendarScheduleFilterInput!
  ) {
    viewAuditSchedules(calendarScheduleFilter: $calendarScheduleFilter) {
      data {
        siteAuditId
        startDate
        endDate
        status
        services
        site
        city
        auditType
        leadAuditor
        siteAddress
        siteRepresentatives
        company
      }
      isSuccess
      message
      errorCode
    }
  }
`;

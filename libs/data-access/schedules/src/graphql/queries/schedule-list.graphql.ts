import { gql } from 'apollo-angular';

export const SCHEDULE_LIST_QUERY = gql`
  query GetAuditSchedules(
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
        siteRepresentatives
        company
        auditID
        siteAddress
        siteZip
        siteCountry
        siteState
        reportingCountry
        projectNumber
      }
      isSuccess
      message
      errorCode
    }
  }
`;

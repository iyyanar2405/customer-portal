import { gql } from 'apollo-angular';

export const SUB_AUDIT_LIST_QUERY = gql`
  query GetSubAudits($auditId: Int!) {
    viewSubAudits(auditId: $auditId) {
      data {
        auditId
        cities
        sites
        services
        status
        startDate
        endDate
        auditorTeam
      }
      errorCode
      message
      isSuccess
    }
  }
`;

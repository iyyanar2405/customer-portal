import { gql } from 'apollo-angular';

export const AUDIT_LIST_QUERY = gql`
  query GetAuditList {
    viewAudits {
      data {
        auditId
        sites
        services
        cities
        countries
        companyName
        status
        startDate
        endDate
        leadAuditor
        type
      }
      isSuccess
      message
      errorCode
    }
  }
`;

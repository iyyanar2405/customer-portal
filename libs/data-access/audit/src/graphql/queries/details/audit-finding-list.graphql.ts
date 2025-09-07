import { gql } from 'apollo-angular';

export const AUDIT_FINDING_LIST_QUERY = gql`
  query GetAuditFindingList($auditId: Int!) {
    viewFindings(auditId: $auditId) {
      data {
        acceptedDate
        auditId
        category
        companyName
        cities
        closedDate
        dueDate
        findingNumber
        findingsId
        openDate
        services
        sites
        status
        title
      }
      errorCode
      isSuccess
      message
    }
  }
`;

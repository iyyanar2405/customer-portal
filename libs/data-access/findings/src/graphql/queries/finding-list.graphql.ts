import { gql } from 'apollo-angular';

export const FINDING_LIST_QUERY = gql`
  query GetFindingList {
    viewFindings {
      data {
        findingsId
        findingNumber
        title
        status
        category
        companyName
        openDate
        dueDate
        acceptedDate
        closedDate
        sites
        services
        cities
        countries
      }
      isSuccess
      message
      errorCode
    }
  }
`;

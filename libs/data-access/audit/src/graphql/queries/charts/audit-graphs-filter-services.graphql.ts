import { gql } from 'apollo-angular';

export const AUDIT_GRAPHS_FILTER_SERVICES_QUERY = gql`
  query GetAuditGraphsFilterServices(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $sites: [Int!]
  ) {
    servicesFilter(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      sites: $sites
    ) {
      data {
        id
        label
      }
      isSuccess
      message
      errorCode
    }
  }
`;

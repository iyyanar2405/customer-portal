import { gql } from 'apollo-angular';

export const AUDIT_GRAPHS_FILTER_SITES_QUERY = gql`
  query GetAuditGraphsFilterSites(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $services: [Int!]
  ) {
    sitesFilter(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      services: $services
    ) {
      data {
        id
        label
        children {
          id
          label
          children {
            id
            label
          }
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;

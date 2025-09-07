import { gql } from 'apollo-angular';

export const FINDING_GRAPHS_FILTER_SITES_QUERY = gql`
  query GetFindingGraphsFilterSites(
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

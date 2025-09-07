import { gql } from 'apollo-angular';

export const FINDING_GRAPHS_FILTER_SERVICES_QUERY = gql`
  query GetFindingGraphsFilterServices(
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

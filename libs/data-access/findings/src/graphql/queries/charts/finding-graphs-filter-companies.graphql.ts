import { gql } from 'apollo-angular';

export const FINDING_GRAPHS_FILTER_COMPANIES_QUERY = gql`
  query GetFindingGraphsFilterCompanies(
    $startDate: String!
    $endDate: String!
    $services: [Int!]
    $sites: [Int!]
  ) {
    companiesFilter(
      startDate: $startDate
      endDate: $endDate
      services: $services
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

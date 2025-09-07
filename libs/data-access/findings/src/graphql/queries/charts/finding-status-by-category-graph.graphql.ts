import { gql } from 'apollo-angular';

export const FINDING_STATUS_BY_CATEGORY_GRAPH_QUERY = gql`
  query GetFindingStatusCategoryStats(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    findingsCategoryStats(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      services: $services
      sites: $sites
    ) {
      data {
        stats {
          category
          statuses {
            status
            count
          }
        }
      }
    }
  }
`;

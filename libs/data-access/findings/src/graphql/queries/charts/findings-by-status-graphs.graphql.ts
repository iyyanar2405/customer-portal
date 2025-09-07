import { gql } from 'apollo-angular';

export const FINDINGS_BY_STATUS_GRAPH_QUERY = gql`
  query GetFindingsByStatusStats(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $services: [Int!]
    $sites: [Int!]
  ) {
    findingsStatusStats(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      services: $services
      sites: $sites
    ) {
      data {
        stats {
          status
          count
          percent
        }
        totalFindings
      }
    }
  }
`;

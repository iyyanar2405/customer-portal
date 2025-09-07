import { gql } from 'apollo-angular';

export const AUDIT_STATUS_BAR_CHART_QUERY = gql`
  query GetAuditByTypeStats(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $sites: [Int!]
    $services: [Int!]
  ) {
    auditTypeStats(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      sites: $sites
      services: $services
    ) {
      data {
        stats {
          type
          statuses {
            status
            count
          }
        }
      }
    }
  }
`;

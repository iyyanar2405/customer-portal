import { gql } from 'apollo-angular';

export const AUDIT_STATUS_DOUGHNUT_CHART_QUERY = gql`
  query GetAuditStatusStats(
    $startDate: String!
    $endDate: String!
    $companies: [Int!]
    $sites: [Int!]
    $services: [Int!]
  ) {
    auditStatusStats(
      startDate: $startDate
      endDate: $endDate
      companies: $companies
      sites: $sites
      services: $services
    ) {
      data {
        stats {
          status
          count
          percent
        }
        totalAudits
      }
    }
  }
`;

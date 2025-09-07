import { gql } from 'apollo-angular';

export const FINDINGS_BY_CLAUSE_LIST_QUERY = gql`
  query GetFindingsByClauseList(
    $filters: FindingsFilterRequestClauseListInput!
  ) {
    findingsByClauseList(filters: $filters) {
      data {
        data {
          name
          majorCount
          minorCount
          observationCount
          toImproveCount
          totalCount
        }
        children {
          data {
            name
            majorCount
            minorCount
            observationCount
            toImproveCount
            totalCount
          }
          children {
            data {
              name
              majorCount
              minorCount
              observationCount
              toImproveCount
              totalCount
            }
          }
        }
      }
      isSuccess
      message
      errorCode
    }
  }
`;

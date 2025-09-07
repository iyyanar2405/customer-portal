import { gql } from 'apollo-angular';

export const GET_PREFERENCE_QUERY = gql`
  query GetPreferences(
    $objectType: String!
    $objectName: String!
    $pageName: String!
  ) {
    preferences(
      objectType: $objectType
      objectName: $objectName
      pageName: $pageName
    ) {
      isSuccess
      data {
        pageName
        objectType
        objectName
        preferenceDetail
      }
    }
  }
`;

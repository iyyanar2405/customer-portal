// export interface BaseApolloResponse {
//   isSuccess: boolean;
//   message: string;
//   errorCode: string;
//   __typename: string;
// }

export interface GraphQLError {
  message: string;
}

export interface BaseApolloResponse<T = any> {
  isSuccess: boolean;
  data: T;
  errorCode: string;
  message: string;
  __typename: string;
}

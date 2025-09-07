export interface BaseApolloResponse {
    isSuccess: boolean;
    message: string;
    errorCode: string;
    __typename: string;
}

export interface GraphQLError {
    message: string;
}
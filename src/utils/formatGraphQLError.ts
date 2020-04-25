import { GraphQLFormattedError, GraphQLError } from 'graphql';
import { ApolloError } from 'apollo-server-express';
import { ArgumentValidationError } from 'type-graphql';

export const formatGraphQLError = (
    error: GraphQLError
): GraphQLFormattedError => {
    if (error.originalError instanceof ApolloError) {
        return error;
    }

    if (error.originalError instanceof ArgumentValidationError) {
        const { extensions, locations, message, path } = error;

        error.extensions.code = 'GRAPHQL_VALIDATION_FAILED';

        return {
            extensions,
            locations,
            message,
            path,
        };
    }

    error.message = 'Internal Server Error';

    return error;
};

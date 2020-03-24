import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../../src/utils/createSchema';
import Maybe from 'graphql/tsutils/Maybe';

interface GraphQLCallOptions {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>;
    token: string;
}

let schema: GraphQLSchema;

export const graphqlCall = async ({
    source,
    variableValues,
    token,
}: GraphQLCallOptions) => {
    if (!schema) {
        schema = await createSchema();
    }
    let authorizationHeader = '';
    if (token && token !== '') {
        authorizationHeader = token;
    }
    return graphql({
        schema,
        source,
        variableValues,
        contextValue: {
            req: {
                headers: {
                    authorization: authorizationHeader,
                },
            },
            res: {
                clearCookie: jest.fn(),
            },
        },
    });
};

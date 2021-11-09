import { graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { createSchema } from '../api/createSchema';

interface GraphQLCallOptions {
    source: string;

    variableValues?: Maybe<{
        [key: string]: any;
    }>;

    token?: string;
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

    return graphql({
        schema,
        source,
        variableValues,
        contextValue: {
            req: {
                headers: {
                    authorization: token,
                },
            },
            res: {
                cookie: jest.fn(),
                clearCookie: jest.fn(),
            },
        },
    });
};

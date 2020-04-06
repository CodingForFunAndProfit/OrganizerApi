import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../api/createSchema';
import Maybe from 'graphql/tsutils/Maybe';
import { Context } from '../types/context';
import express from 'express';

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

import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { HomeResolver } from '../modules/home/home.resolver';
import { UserResolver } from '../modules/user/user.resolver';
import { GraphQLSchema } from 'graphql';

export const createSchema = async (): Promise<GraphQLSchema> => {
    try {
        const schema = await buildSchema({
            resolvers: [HomeResolver, UserResolver],
            validate: true,
            /*
            authChecker: ({ context: { req } }) => {
                return !!req.session.userId; // !! casts to a boolean
            },
            */
            container: Container,
        });
        return schema;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

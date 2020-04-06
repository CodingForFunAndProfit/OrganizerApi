import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { HomeResolver } from '../modules/home/home.resolver';
import { UserResolver } from '../modules/user/user.resolver';

export const createSchema = () =>
    buildSchema({
        resolvers: [HomeResolver, UserResolver],
        validate: false,
        /*
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId; // !! casts to a boolean
        },
        */
        container: Container,
    });

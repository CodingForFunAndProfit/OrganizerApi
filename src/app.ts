import express from 'express';
import { Application } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import * as path from 'path';
import appRoot from 'app-root-path';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { connectTypeorm } from './config/connectTypeorm';
import { createSchema } from './api/createSchema';
import { formatGraphQLError } from './utils/formatGraphQLError';
import { GraphQLError } from 'graphql';

import connectRedis from 'connect-redis';
import { redis } from './utils/redis';

import logger from './config/winston';

import HomeController from './modules/home/home.controller';
import UserController from './modules/user/user.controller';
import SubscriptionController from './modules/subscription/subscription.controller';

export default class App {
    public app: Application;
    public apolloServer: ApolloServer;
    public APIPATH = '/api';

    constructor() {
        this.app = express();

        this.connectDatabase();

        this.applyMiddlewares();
        this.assets();

        this.app.get('/', new HomeController().router);
        this.app.get('/user', new UserController().router);
        this.app.get('/push', new SubscriptionController().router);

        this.initSchema();
    }
    private assets() {
        this.app.use(express.static('public'));
        // this.app.use(express.static('views'));
    }

    private applyMiddlewares() {
        const clientOrigin = process.env.CLIENT_ORIGINS?.split(',');
        this.app.use(
            cors({
                credentials: true,
                origin: clientOrigin,
            })
        );

        this.app.use(morgan('combined', { stream: logger }));
        this.app.use(express.static(path.resolve(`${appRoot}`, 'public')));
        this.app.use(favicon(path.resolve(`${appRoot}`, 'public/favicon.ico')));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        const RedisStore = connectRedis(session);

        this.app.use(
            session({
                store: new RedisStore({
                    client: redis as any,
                }),
                name: 'qid',
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
                },
            } as any)
        );
        this.app.use(compression());
    }
    public async initSchema(): Promise<void> {
        const schema = await createSchema();
        this.apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }: any) => ({ req, res }),
            introspection: true,
            formatError: (error: GraphQLError) => {
                return formatGraphQLError(error);
            },
            plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        });

        await this.apolloServer.start();
        this.apolloServer.applyMiddleware({
            app: this.app,
            path: this.APIPATH,
            cors: false,
        });
    }

    public async connectDatabase(): Promise<void> {
        try {
            await connectTypeorm();
            logger.info('Connected to database');
        } catch (error) {
            logger.error(error);
        }
    }

    public listen(port: any) {
        return this.app.listen(port);
    }
}

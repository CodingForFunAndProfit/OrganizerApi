import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import { HelloController } from './controllers';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from './utils/createSchema';
/*
import queryComplexity, {
    fieldExtensionsEstimator,
    simpleEstimator,
} from 'graphql-query-complexity';
*/
import connectRedis from 'connect-redis';
import { redis } from './utils/redis';
import { getTypeormConnection } from './utils/createConnection';

const app = Express();
const main = async () => {
    const typeormconfig = await getTypeormConnection();
    // console.log(typeormconfig);

    await createConnection(typeormconfig);

    const schema = await createSchema();

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }: any) => ({ req, res }),
        playground: true,
        introspection: true,
    });

    // const clientOrigin = origin: 'http://herokuurl';
    const clientOrigin = '*';
    app.use(
        cors({
            credentials: true,
            origin: clientOrigin,
        })
    );
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(morgan('tiny'));

    const RedisStore = connectRedis(session);

    app.use(
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

    app.use(compression());

    app.use('/', HelloController);

    const APIPATH = '/api';

    apolloServer.applyMiddleware({ app, path: APIPATH });
};

export const appPromise = main().then(() => app);

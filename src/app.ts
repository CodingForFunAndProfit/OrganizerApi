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
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken, createRefreshToken } from './utils/createTokens';

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
        /* ValidationRules not working currently (no queryvabriables)
        validationRules: [
            queryComplexity({
                // The maximum allowed query complexity, queries above this threshold will be rejected
                maximumComplexity: 8,
                // The query variables. This is needed because the variables are not available
                // in the visitor of the graphql-js library
                variables: {},
                // Optional callback function to retrieve the determined query complexity
                // Will be invoked whether the query is rejected or not
                // This can be used for logging or to implement rate limiting
                // tslint:disable-next-line: variable-name
                onComplete: (_complexity: number) => {
                    // console.log('Query Complexity:', complexity);
                },
                estimators: [
                    // Using fieldConfigEstimator is mandatory to make it work with type-graphql
                    // fieldConfigEstimator(),
                    // DEPRECATION WARNING: fieldConfigEstimator is deprecated. Use fieldExtensionsEstimator instead
                    fieldExtensionsEstimator(),
                    // This will assign each field a complexity of 1 if no other estimator
                    // returned a value. We can define the default value for fields not explicitly annotated
                    simpleEstimator({
                        defaultComplexity: 1,
                    }),
                ],
            }) as any,
],
        */
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

    app.use(async (req: any, res: any, next) => {
        console.log(req.cookies);
        const refreshToken = req.cookies['refresh-token'];
        const accessToken = req.cookies['access-token'];
        if (!refreshToken && !accessToken) {
            return next();
        }
        let data;
        try {
            data = verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as any;
            // accessToken verified
            req.userId = data.userId;
            return next();
        } catch {
            // console.log
        }

        if (!refreshToken) {
            return next();
        }

        try {
            data = verify(
                refreshToken,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as any;
            // refreshToken verified
        } catch {
            return next();
        }
        const user = await User.findOne(data.userId);
        if (!user) {
            // invalid tokens
            return next();
        }

        res.cookie('refresh-token', createRefreshToken(user));
        res.cookie('access-token', createAccessToken(user));

        req.userId = data.userId;

        next();
    });

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

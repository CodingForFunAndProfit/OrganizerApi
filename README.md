# OrganizerApi

## Using it

-   you need a .env file in the root folder
    ---snip
    REDISLABSURL=your-redislabs-url.com:18609
    REDISLABSPASSWORD=YourRedisLabPassword
    SESSION_SECRET=ASessionSecret
    EMAILACCOUNT=mailadress@gmail.com
    EMAILPASSWORD=mailadresspassword
    REFRESH_TOKEN_SECRET=RefreshtokenSecret
    ACCESS_TOKEN_SECRET=AccesstokenSecret
    ---snip

## Technologies

-   ExpressJS
    -   express-session, cors, body-parser, compression, cookie-parser
-   Graphql
    -   apollo-server-express, type-graphql
-   Postgres
    -   typeorm
-   Redis
-   nodemailer

### Database

PostgreSQL / TypeORM:

-   Migrations:

    -   typeorm migration:generate -n 'MigrationName'
    -   typeorm migration:run
    -   typeorm migration:revert
        -   typeorm migration:create -n 'MigrationName' // manually make a migration

-   Postgresql:
    -   CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; // for using uuids

## Workflow

-   VSCODE
-   development db synchronized, test db with migrations, production db with migrations
-   feature commit to github
-   merge on successful tests and deliver to production

## TODOS

-   restructuring / better of files&modules
-   confirm user link generation config file for dev and live
-   continuous integration / well defined workflow
-   tests, frst working examples exist -> finish current resolvers
-   github commit messages styleguide
-   databases (dev, test & production) -> finalize workflow with ci / createConnection is bad right now
-   docker yes / no?

## Links

-   [Postman: Test Api calls](https://www.postman.com)
-   [JWT: The Complete Guide to JSON Web Tokens](https://blog.angular-university.io/angular-jwt/)
-   [Express-JWT](https://github.com/auth0/express-jwt)
-   [Ben Awad: JWT Auth Example](https://github.com/benawad/jwt-auth-example)
-   [GraphQL](https://graphql.org)
    -   [GraphQL Authetication and Middleware](https://graphql.org/graphql-js/authentication-and-express-middleware/)
-   [TypeGraphQL](https://github.com/MichalLytek/type-graphql)
-   [TypeGraphQL.com](https://typegraphql.com)
-   [GraphQL API with TypeGraphQL and TypeORM](https://dev.to/bnevilleoneill/how-to-build-a-graphql-api-with-typegraphql-and-typeorm-58fb)
-   [How To GraphQL - Angular Apollo - Authetication](https://www.howtographql.com/angular-apollo/5-authentication/)
-   [Handling Authetication in GraphQL](https://blog.pusher.com/handling-authentication-in-graphql/)
-   [Authentication and Authorization in GraphQL with Modules](https://medium.com/the-guild/authentication-and-authorization-in-graphql-and-how-graphql-modules-can-help-fadc1ee5b0c2)
-   [TypeORM Migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#generating-migrations)
-   [TypeORM Migrations PostgreSQL](https://wanago.io/2019/01/28/typeorm-migrations-postgres/)
-   [Node best practices](https://github.com/goldbergyoni/nodebestpractices)
-   [Redislab](https://app.redislabs.com/#/login)
-   [TypeGraphQl Ben Awad](https://github.com/benawad/type-graphql)
-   [TypeScript](https://www.typescriptlang.org/docs/home.html)
-   [Unit and Integrationtesting for NodeJS](https://blog.logrocket.com/unit-and-integration-testing-for-node-js-apps/)
-   [Testing a GraphQL Server using Jest](https://medium.com/entria/testing-a-graphql-server-using-jest-4e00d0e4980e)
-   [Integration testing wiht Apollo Server](https://www.apollographql.com/docs/apollo-server/testing/testing/)
-   [Draft for JWT BEst Practises](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
-   [GraphQL Chat](https://github.com/alex996/graphql-chat)
-   [ExpressJS & GraphQL — Authentication & Access Control](https://itnext.io/expressjs-graphql-authentication-access-control-c5c8fe360b07)
-   [parabol application](https://github.com/ParabolInc/parabol)
-   [reddit: testing](https://www.reddit.com/r/expressjs/comments/9fua5k/integration_tests_am_i_doing_it_right/)

## Application

-   Entities: User, Action
-   Modules: hello, User, Action

    -   User:
        -   Resolvers: Register, Login, Logout, forgotPassword, changePassword, confirmUser, Me
    -   Action:
        -   Resolvers: GetAction, GetAllActions, CreateAction, UpdateAction, DeleteAction
    -   Hello:
        -   Resolvers: HelloWorld

-   JsonWebToken (JWT):
    -   Access & RefreshToken

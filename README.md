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

PostgreSQL:

-   Migrations

## Links

-   [Postman: Test Api calls](https://www.postman.com)

## TODOS

-   confirm user link generation config file for dev and live
-   Migrations

## Links

-   [JWT: The Complete Guide to JSON Web Tokens](https://blog.angular-university.io/angular-jwt/)
-   [TypeGraphQL](https://github.com/MichalLytek/type-graphql)
-   [TypeGraphQL.com](https://typegraphql.com)
-   [How To GraphQL - Angular Apollo - Authetication](https://www.howtographql.com/angular-apollo/5-authentication/)
-   [TypeORM Migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#generating-migrations)
-   [TypeORM Migrations PostgreSQL](https://wanago.io/2019/01/28/typeorm-migrations-postgres/)

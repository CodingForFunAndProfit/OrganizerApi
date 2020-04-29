[![build status](https://github.com/CodingForFunAndProfit/OrganizerApi/NodeJSCI/badge.svg)](https://github.com/CodingForFunAndProfit/OrganizerApi/actions)

# OrganizerApi

## Using it

-   you need a .env file in the root folder
    ---snip
    DATABASE_URL=postgres://user:pass@localhost:5432/dbname
    REDISLABSURL=your-redislabs-url.com:18609
    REDISLABSPASSWORD=YourRedisLabPassword
    SESSION_SECRET=ASessionSecret
    EMAILACCOUNT=mailadress@gmail.com
    EMAILPASSWORD=mailadresspassword
    REFRESH_TOKEN_SECRET=RefreshtokenSecret
    ACCESS_TOKEN_SECRET=AccesstokenSecret
    FRONTEND_URL=http://localhost:4200
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
-   jsonwebtoken
-   winston
-   github actions & heroku pipeline

### Database

PostgreSQL / TypeORM:

-   Migrations:

    -   typeorm migration:generate -n 'MigrationName'
    -   typeorm migration:run
    -   typeorm migration:revert
        -   typeorm migration:create -n 'MigrationName' // manually make a migration

-   Postgresql:
    -   CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; // for using uuids

## Application

-   Entities: User, Action
-   Modules: hello, User, Action

    -   User:
        -   Resolvers: Register, Login, Logout, forgotPassword, changePassword, confirmUser, Me, users, pagedusers, createUser, readUser, updateUser, deleteUser
    -   Action:
        -   Resolvers: GetAction, GetAllActions, CreateAction, UpdateAction, DeleteAction
    -   Hello:
        -   Resolvers: HelloWorld

-   JsonWebToken (JWT):
    -   Access & RefreshToken

## Environment

### Databases

-   local:
    -   development database (synced on each compile)
    -   test database (not synced used to test migrations and tests)
-   server:
    -   heroku: staging app database
    -   heroku: production app database

### Hosting

## Workflow

-   work on feature branches
-   development db synchronized, test db with migrations
-   push featurebranch
-   pull request
-   merge and deploy to staging
-   short staging test -> promote to production
-   delete feature branch

## TODOS

-   read environment vars and set app-vars with default if something is missing
-   restructuring / better of files&modules
-   github commit messages styleguide

-   linkmanager (saving links, auto tag them, display them after search...)
-   add functionality and tests for invalidating tokens
-   add rolebased authorization for admins/users/other groups

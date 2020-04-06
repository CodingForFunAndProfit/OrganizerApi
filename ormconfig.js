module.exports = [
    {
        name: 'default',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        logging: false,
        entities: ['./dist/entity/*.js'],
        migrations: ['./dist/database/migrations/*.js'],
        cli: {
            entitiesDir: './dist/entity',
            migrationsDir: './dist/database/migrations',
        },
        // migrationsRun: true, // works too on heroku, but bad practise?
    },
    {
        name: 'development',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: ['./src/entity/*.ts'],
        cli: {
            entitiesDir: './src/entity',
        },
    },
    {
        name: 'test',
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: ['./src/entity/*.ts'],
        migrations: ['./src/database/migrations/*.ts'],
        cli: {
            entitiesDir: './src/entity',
            migrationsDir: './src/database/migrations',
        },
    },
    {
        name: 'migration',
        type: 'postgres',
        url: process.env.TESTDATABASE_URL,
        synchronize: true,
        logging: false,
        entities: ['./src/entity/*.ts'],
        migrations: ['./src/database/migrations/*.ts'],
        cli: {
            entitiesDir: './src/entity',
            migrationsDir: './src/database/migrations',
        },
    },
];

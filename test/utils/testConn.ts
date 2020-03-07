import { createConnection } from 'typeorm';

export const testConn = (drop: boolean = false) => {
    if (process.env.DATABASE_URL) {
        return createConnection({
            name: 'default',
            type: 'postgres',
            url: process.env.DATABASE_URL,
            synchronize: drop,
            dropSchema: drop,
            entities: [__dirname + '/../../src/entity/*.*']
        });
    } else {
        return createConnection({
            name: 'default',
            type: 'postgres',
            host: 'localhost',
            port: 5433,
            username: 'username',
            password: 'password',
            database: 'database-test',
            synchronize: drop,
            dropSchema: drop,
            entities: [__dirname + '/../../src/entity/*.*']
        });
    }
};

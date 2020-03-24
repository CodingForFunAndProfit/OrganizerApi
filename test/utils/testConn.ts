import { createConnection, getConnectionOptions } from 'typeorm';

export const testConn = async (drop: boolean = false) => {
    const connectionOptions = await getConnectionOptions();
    if (process.env.DATABASE_URL) {
        return createConnection({
            name: 'default',
            type: 'postgres',
            url: process.env.DATABASE_URL,
            synchronize: drop,
            dropSchema: drop,
            entities: [__dirname + '/../../src/entity/*.*'],
        });
    } else {
        // console.log(connectionOptions);
        return createConnection(connectionOptions);
    }
};

import { getConnectionOptions, ConnectionOptions } from 'typeorm';

export const getTypeormConnection = async () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = {
        type: 'postgres',
        synchronize: true,
        logging: false,
        extra: {
            ssl: true,
        },
        entities: ['dist/entity/*.*'],
    };
    if (process.env.DATABASE_URL) {
        Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
    } else if (
        process.env.NODE_ENV &&
        process.env.NODE_ENV!.trim() === 'production'
    ) {
        connectionOptions = await getConnectionOptions('distfolderlocal');
    } else {
        connectionOptions = await getConnectionOptions();
    }

    return connectionOptions;
};

import { getConnectionOptions, ConnectionOptions } from 'typeorm';
import Debug from 'debug';
const debug = Debug('app');

export const getTypeormConnection = async () => {
    let connectionOptions: ConnectionOptions;

    debug('NODE_ENV: ' + process.env.NODE_ENV);
    connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

    debug('Using Databaseconfig: ' + connectionOptions.name);
    return connectionOptions;
};

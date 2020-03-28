import { createConnection, getConnectionOptions } from 'typeorm';
import Debug from 'debug';
const debug = Debug('app');

export const testConn = async () => {
    const connectionOptions = await getConnectionOptions('test');

    debug('Using Databaseconfig: ' + connectionOptions.name);
    return await createConnection(connectionOptions);
};

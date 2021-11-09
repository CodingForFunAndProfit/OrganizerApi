import { getConnectionOptions, ConnectionOptions, Connection } from 'typeorm';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';

import Debug from 'debug';
const debug = Debug('app');

export const connectTypeorm = async (): Promise<Connection> => {
    let connectionName = 'default';
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development') {
        connectionName = 'development';
    }
    if (process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'test') {
        connectionName = 'test';
    }

    // return ConnectByName(connectionName);
    return getConnectionToDefault(connectionName);
};

const getConnectionToDefault = async (
    connectionName: string
): Promise<Connection> => {
    let connection = null;
    let connectionOptions: ConnectionOptions;
    try {
        connectionOptions = await getConfiguredOptions(connectionName);
        Object.assign(connectionOptions, { name: 'default' });

        // console.log(connectionOptions);
        useContainer(Container, { fallbackOnErrors: true });
        connection = await createConnection(connectionOptions);
        debug('Connection name:' + connection.name);
    } catch (error) {
        debug(error);
    }

    return connection;
};

const ConnectByName = async (connectionName: string): Promise<Connection> => {
    let connection = null;
    let connectionOptions: ConnectionOptions;
    try {
        connectionOptions = await getConfiguredOptions(connectionName);
        connection = await createConnection(connectionOptions);
        debug('Connection name:' + connection.name);
    } catch (error) {
        debug(error);
    }

    return connection;
};

const getConfiguredOptions = async (
    connectioName = ''
): Promise<ConnectionOptions> => {
    let connectionOptions: ConnectionOptions;
    if (connectioName === '') {
        connectionOptions = await getConnectionOptions();
    } else {
        connectionOptions = await getConnectionOptions(connectioName);
    }

    debug(connectionOptions);
    return connectionOptions;
};

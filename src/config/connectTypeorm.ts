import { getConnectionOptions, ConnectionOptions, Connection } from 'typeorm';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';

import Debug from 'debug';
const debug = Debug('app');

export const connectTypeorm = async (): Promise<Connection> => {
    // first way // writing them directly
    // return firstWay();

    // second way // environment variables
    // return secondWay();

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
        useContainer(Container);
        connection = await createConnection(connectionOptions);
        debug('Connection name:' + connection.name);
    } catch (error) {
        debug(error);
    }

    return connection;
};

// test with graphql later with a different name, NOT default
const firstWay = async (): Promise<Connection> => {
    let connection = null;
    try {
        connection = await createConnection({
            type: 'postgres',
            url: 'postgres://dev:devpassword@localhost:5433/herokuexpressdevdb',
        });

        debug('Connection name:' + connection.name);
    } catch (error) {
        debug(error);
    }

    return connection;
};
// automatically uses dotenv to get environment variables, in theory no need to include it in the app
const secondWay = async (): Promise<Connection> => {
    let connection = null;
    let connectionOptions: ConnectionOptions;
    try {
        connectionOptions = await getConfiguredOptions();
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
        connectionOptions = await getConnectionOptions(); // always tries to get default connection?
    } else {
        connectionOptions = await getConnectionOptions(connectioName);
    }

    debug(connectionOptions);
    return connectionOptions;
};

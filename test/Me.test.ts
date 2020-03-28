// import { testConn } from './utils/testConn';
import {
    Connection,
    createConnection,
    ConnectionOptions,
    getConnectionOptions,
} from 'typeorm';
// import { gCall } from './utils/gCall';
import faker from 'faker';
import { User } from '../src/entity/User';
import { graphqlCall } from './utils/graphqlCall';
import { createAccessToken } from '../src/utils/createTokens';
// import request from 'supertest';
// import { appPromise } from '../src/app';
import dotenv from 'dotenv';
dotenv.config();

let conn: Connection;
beforeAll(async () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    console.log(connectionOptions.name);
    conn = await createConnection(connectionOptions);
    // conn = await testConn();
});

afterAll(async () => {
    if (conn) await conn.close();
});

const meQuery = `
{
    me {
      firstName
      lastName
      email
    }
}
`;

describe('Me Query', () => {
    it('It should return null without login', async () => {
        const response = await graphqlCall({
            source: meQuery,
            variableValues: {},
            token: '',
        });
        // console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
        expect(response).toMatchObject({
            data: {
                me: null,
            },
        });
    });
    /*
    it('GoodByQuery', async () => {
        const query = `
        {
            GoodBye
        }
        `;
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email().replace('_', '.'),
            password: faker.internet.password(5),
        }).save();

        const accessToken = createAccessToken(user.id);
        // console.log('Token: ' + accessToken);
        const response = await graphqlCall({
            source: query,
            variableValues: {},
            token: accessToken,
        });
        // console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
        expect(response).toMatchObject({
            data: {
                GoodBye: 'your user id is: ' + user.id,
            },
        });
    });
*/
    it('Show loggedin user data', async () => {
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email().replace('_', '.'),
            password: faker.internet.password(5),
        }).save();

        const accessToken = createAccessToken(user.id);
        // console.log('Token: ' + accessToken);
        const response = await graphqlCall({
            source: meQuery,
            variableValues: {},
            token: accessToken,
        });
        // console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
    });
});

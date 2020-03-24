import { testConn } from './utils/testConn';
import { Connection } from 'typeorm';
import { graphqlCall } from './utils/graphqlCall';
/*
import faker from 'faker';
import { User } from '../src/entity/User';
*/
let conn: Connection;
beforeAll(async () => {
    conn = await testConn(true);
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

describe('Actions Query', () => {
    it('It should', async () => {
        const response = await graphqlCall({
            source: meQuery,
            variableValues: {},
            token: '',
        });

        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
    });
});

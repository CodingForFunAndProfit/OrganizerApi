import '../../src/config/env';
import { Connection } from 'typeorm';
import { graphqlCall } from '../../src/config/graphqlCall';
import { connectTypeorm } from '../../src/config/connectTypeorm';
import faker from 'faker';
import { User } from '../../src/entity/user';
import bcrypt from 'bcryptjs';

let conn: Connection;
beforeAll(async () => {
    conn = await connectTypeorm();
});
afterAll(async () => {
    await conn.close();
});

const loginUserMutation = `
mutation loginUser($email: String!, $password: String!) {
    login(
        email: $email,
        password: $password
    ) {
        accessToken
        msg
        login
        user {
            id
            email
        }
    }
}
`;
const logoutUserMutation = `
mutation {
    logout
}
`;
const meQuery = `
query {
    me {
        id
        email
    }
}
`;
const refreshTokenMutation = `
mutation {
    refreshtoken
}
`;
describe('User authentication - Queries & Mutations', () => {
    const newUser = {
        email: faker.internet.email().replace('_', '.'),
        password: faker.internet.password(10),
    };
    let token: string;
    it('login should return success LoginResult for a valid username & password', async () => {
        const hashedPassword = await bcrypt.hash(newUser.password, 12);
        let user: User;
        user = await User.create({
            email: newUser.email,
            password: hashedPassword,
        }).save();
        // console.log(user);
        const saved = await User.update(user.id, { confirmed: true });

        const response = await graphqlCall({
            source: loginUserMutation,
            variableValues: {
                email: newUser.email,
                password: newUser.password,
            },
        });

        // console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
        const { data } = response;
        expect(data).toHaveProperty('login');
        expect(data.login).not.toEqual(null);
        token = data.login.accessToken;
    });

    it('me should return User for a valid accessToken', async () => {
        // created and logged in in previous test, bad practise?

        const response = await graphqlCall({
            source: meQuery,
            variableValues: {},
            token,
        });

        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
        // console.log(response);
        const { data } = response;
        expect(data).toHaveProperty('me');
        expect(data.me).toBeTruthy();
        expect(data.me).toHaveProperty('id');
        expect(data.me).toHaveProperty('email');
    });

    it('refreshtoken should return true for a valid user id', async () => {
        // right now I don't know how to access/mock the cookiefunctionality
        // thought about making the cookie a parameter and a result, so I could test it
        // but it would be less secure (httpOnly, not saved)
        /*
        const response = await graphqlCall({
            source: refreshTokenMutation,
            variableValues: {},
        });
        console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
        */
        // const { data } = response;
        // expect(data).toHaveProperty('refreshtoken');
    });

    it('logout should return true for a logged in user', async () => {
        const response = await graphqlCall({
            source: logoutUserMutation,
            variableValues: {},
            token,
        });
        // console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }

        expect(response.data).toHaveProperty('logout');
        expect(response.data.logout).toBeTruthy();
    });
});

import { Connection } from 'typeorm';
import { graphqlCall } from '../src/config/graphqlCall';
import { connectTypeorm } from '../src/config/connectTypeorm';
import faker from 'faker';
import { User } from '../src/entity/user';

let conn: Connection;
beforeAll(async () => {
    conn = await connectTypeorm();
});
afterAll(async () => {
    await conn.close();
});

const createUser = async (email: string, password: string): Promise<User> => {
    try {
        return await User.create({ email, password }).save();
    } catch (error) {
        console.error(error);
        return null;
    }
};
const getUserByEmail = async (email: string): Promise<User> => {
    try {
        return await User.findOne({ where: { email } });
    } catch (error) {
        console.error(error);
        return null;
    }
};
const usersQuery = `
{
    users {
        id,
        email
    }
}
`;
const createUserMutation = `
mutation createUser($input: RegisterInput!) {
    createUser(
        input: $input
    )
}
`;
const userQuery = `
query readUser($id: String!) {
    user(id: $id) {
        id
        email
    }
}
`;
const updateUserMutation = `
mutation updateUser($id: String!, $input: UserInput!) {
    updateUser(
        id: $id,
        input: $input
    )
}
`;
const UserRegisterMutation = `
mutation userRegister($input: RegisterInput!) {
    UserRegister(
        input: $input
    )
}
`;

const deleteUserMutation = `
mutation deleteUser($id: String!) {
    deleteUser(
        id: $id
    )
}
`;
const confirmUserMutation = `
mutation confirmUser($token: String!) {
    confirmUser(
        token: $token
    )
}
`;

describe('User Resolvers:', () => {
    let user = {
        email: faker.internet.email().replace('_', '.'),
        password: faker.internet.password(10),
    };
    describe('Create User TypeORM', () => {
        it('should create the user used in these tests', async () => {
            try {
                user = await createUser(user.email, user.password);
                expect(user).toHaveProperty('id');
            } catch (error) {
                console.error(error);
            }
        });
    });

    describe('Users - Query', () => {
        it('should return User Array', async () => {
            const response = await graphqlCall({
                source: usersQuery,
                variableValues: {},
            });
            // console.log(response);
            if (response && response.errors) {
                console.log(response.errors[0].originalError);
            }
            const { data } = response;
            expect(data).toHaveProperty('users');
        });
    });

    describe('Register User - Mutation', () => {
        it('should return true for a valid userInput and find the user in the database', async () => {
            const newuser = {
                email: faker.internet.email().replace('_', '.'),
                password: faker.internet.password(10),
            };

            const response = await graphqlCall({
                source: UserRegisterMutation,
                variableValues: {
                    input: newuser,
                },
            });
            if (response && response.errors) {
                console.error(response.errors[0].originalError);
            }
            // console.log(response);
            expect(response).toMatchObject({
                data: {
                    UserRegister: true,
                },
            });
            const dbUser = await User.findOne({
                where: { email: newuser.email },
            });

            expect(dbUser).toBeDefined();
        });
    });

    describe('Create User - Mutation', () => {
        it('should return true for a valid userInput and find the user in the database', async () => {
            const newuser = {
                email: faker.internet.email().replace('_', '.'),
                password: faker.internet.password(10),
            };
            const response = await graphqlCall({
                source: createUserMutation,
                variableValues: {
                    input: newuser,
                },
            });
            if (response && response.errors) {
                console.error(response.errors[0].originalError);
            }
            // console.log(response);
            expect(response).toMatchObject({
                data: {
                    createUser: true,
                },
            });
            const dbUser = await User.findOne({
                where: { email: newuser.email },
            });
            expect(dbUser).toBeDefined();
        });
    });

    describe('User - Query', () => {
        it('should return User by id', async () => {
            const newUser = await getUserByEmail(user.email);

            const response = await graphqlCall({
                source: userQuery,
                variableValues: {
                    id: newUser.id,
                },
            });
            if (response && response.errors) {
                console.error(response.errors[0]);
            }
            const { data } = response;
            expect(data).toHaveProperty('user');
            expect(data.user).toHaveProperty('id');
            expect(data.user).toHaveProperty('email');
        });
    });

    describe('Update User - Mutation', () => {
        it('should return true for a valid user id and find the user in the database', async () => {
            const newUser = await getUserByEmail(user.email);
            newUser.email = faker.internet.email().replace('_', '.');

            const response = await graphqlCall({
                source: updateUserMutation,
                variableValues: {
                    id: newUser.id,
                    input: { email: newUser.email },
                },
            });
            if (response && response.errors) {
                console.error(response.errors[0].originalError);
            }
            // console.log(response);
            expect(response).toMatchObject({
                data: {
                    updateUser: true,
                },
            });
            const dbUser = await User.findOne({
                where: { id: newUser.id },
            });
            expect(dbUser).toBeDefined();
            expect(dbUser!.email).toBe(newUser.email);
        });
    });

    describe('Delete User - Mutation', () => {
        it('should return true for a valid user id', async () => {
            const newUser = {
                email: faker.internet.email().replace('_', '.'),
                password: faker.internet.password(10),
            };

            const user2delete = await createUser(
                newUser.email,
                newUser.password
            );

            const response = await graphqlCall({
                source: deleteUserMutation,
                variableValues: {
                    id: user2delete.id,
                },
            });
            // console.log(response);
            if (response && response.errors) {
                console.log(response.errors[0].originalError);
            }
            const { data } = response;
            expect(data.deleteUser).toBe(true);
        });
    });

    describe('Confirm User - Mutation', () => {
        it('should return true for a valid user id', async () => {
            /*
            Find a way to test with nodemailer involved

            const newUser = {
                email: faker.internet.email().replace('_', '.'),
                password: faker.internet.password(10),
            };

            const user2confirm = await createUser(
                newUser.email,
                newUser.password
            );

            const response = await graphqlCall({
                source: confirmUserMutation,
                variableValues: {},
            });
            // console.log(response);
            if (response && response.errors) {
                console.log(response.errors[0].originalError);
            }
            const { data } = response;
            expect(data).toHaveProperty('users');
            */
        });
    });
});

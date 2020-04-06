import { graphqlCall } from '../src/config/graphqlCall';

const helloQuery = `
{
    hello
}
`;
describe('Hello Query', () => {
    it('should return hello world', async () => {
        const response = await graphqlCall({
            source: helloQuery,
            variableValues: {},
        });
        // console.log(response);
        if (response && response.errors) {
            console.log(response.errors[0].originalError);
        }
        expect(response).toMatchObject({
            data: {
                hello: 'Hello World',
            },
        });
    });
});

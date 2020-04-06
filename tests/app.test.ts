import request from 'supertest';
import app from '../src/server';

/*
beforeEach(async () => {
    await request(app);
});
*/
afterEach(async () => {
    app.close();
});

describe('Testing routes: ', () => {
    it('GET / should return statusCode 200', async () => {
        return request(app)
            .get('/')
            .expect(200, 'Hello World!');
    });
});

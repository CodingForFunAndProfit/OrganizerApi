import request from 'supertest';
import { appPromise } from '../src/app';

describe('GET /api', () => {
    it('should return 200 OK', async () => {
        await appPromise
            .then((app: Express.Application) => {
                request(app)
                    .get('/api')
                    .expect(200);
            })
            .catch((error) => {
                console.error('Error:' + error);
            });
    });
});

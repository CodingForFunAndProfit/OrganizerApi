import request from 'supertest';
import { appPromise } from '../src/app';

test('should return Hello, World!', async (done) => {
    await appPromise
        .then((app: Express.Application) => {
            request(app)
                .get('/')
                .expect(200, 'Hello, World!')
                .end((err: any) => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        })
        .catch((error) => {
            console.error('Error:' + error);
        });
});

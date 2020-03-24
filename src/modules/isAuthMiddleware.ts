import { MiddlewareFn } from 'type-graphql';
import { Context, TokenPayload } from '../types/Context';
import { verifyToken } from '../utils/verifyToken';

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
    const token = context.req.headers.authorization;
    // console.log('isAuth:token: ' + token);
    if (!token) {
        throw new Error('not authenticated');
    }
    try {
        const tokenPayload = (await verifyToken(token)) as TokenPayload;
        context.payload = tokenPayload;
    } catch (error) {
        throw new Error('not authenticated');
    }
    return next();
};

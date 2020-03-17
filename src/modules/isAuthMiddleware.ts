import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/Context';
import { verify } from 'jsonwebtoken';

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
    const auth = (context as Context).req.headers.authorization;

    if (!auth) {
        throw new Error('not authenticated');
    }

    try {
        const payload = verify(auth, process.env.ACCESS_TOKEN_SECRET!);
        (context as Context).payload = payload as any;
    } catch (error) {
        // console.log(error);
        throw new Error('not authenticated');
    }
    return next();
};

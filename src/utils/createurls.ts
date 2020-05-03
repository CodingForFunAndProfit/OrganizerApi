import { v4 } from 'uuid';
import { redis } from './redis';

export const confirmUserPrefix = 'confirmUser:';
export const forgotPasswordPrefix = 'forgotPassword:';

export const createConfirmationUrl = (userId: string) => {
    const id = v4();

    try {
        redis.set(confirmUserPrefix + id, userId, 'ex', 60 * 60 * 24);
        return `${process.env.FRONTEND_URL}/confirmuser/${id}`;
    } catch (error) {
        console.error(error);
    }
    return;
};

export const createForgotPasswordUrl = (userId: string) => {
    const id = v4();

    try {
        redis.set(forgotPasswordPrefix + id, userId, 'ex', 60 * 60 * 24); // 1 day expiration
        return `${process.env.FRONTEND_URL}/changepassword/${id}`;
    } catch (error) {
        console.error(error);
    }
    return;
};

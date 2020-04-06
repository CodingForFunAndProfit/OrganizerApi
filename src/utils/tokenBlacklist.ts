import { redis } from './redis';
export const blacklistTokenPrefix = 'blacklisted:';

export const blacklistToken = (token: string) => {
    try {
        // xpire when the token would expire
        redis.set(token, 1, 'ex', 60 * 60 * 24);
    } catch (error) {
        console.error(error);
    }
};

export const isStillValid = async (token: string): Promise<boolean> => {
    try {
        const result = await redis.get(token);
        if (result) {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
};

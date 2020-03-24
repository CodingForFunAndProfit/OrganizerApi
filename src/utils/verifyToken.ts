import { verify } from 'jsonwebtoken';

export const verifyToken = async (token: string): Promise<object | string> => {
    try {
        return verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;
        // accessToken verified
    } catch (error) {
        throw new Error('not authenticated');
    }
};

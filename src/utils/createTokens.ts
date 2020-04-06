import { sign } from 'jsonwebtoken';

export const createAccessToken = (uid: string) => {
    return sign({ userId: uid }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: '120min',
    });
};

export const createRefreshToken = (uid: string) => {
    return sign({ userId: uid }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: '5d',
    });
};

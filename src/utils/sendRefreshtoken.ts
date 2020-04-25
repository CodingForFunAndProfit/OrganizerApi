import { Response } from 'express';

export const refreshTokenName = 'refreshtoken';

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie(refreshTokenName, token, {
        httpOnly: false,
    });
};

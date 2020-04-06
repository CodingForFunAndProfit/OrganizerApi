import { Request, Response } from 'express';

export interface TokenPayload {
    userId: string;
    iat: Date;
    exp: Date;
}
export interface Context {
    req: Request;
    res: Response;
    payload: TokenPayload;
}

import { Request, Response } from 'express';
// import { User } from '../entity/User';

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

import { User } from '../entity/User';
import { verify } from 'jsonwebtoken';

export async function getUserByToken(token: string): Promise<User | undefined> {
    // Here, use the `token` argument, check it's validity, and return
    // the user only if the token is valid.
    // You can also use external auth libraries, such as jsaccounts / passport, and
    // trigger it's logic from here.
    let data;
    try {
        data = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as any;
        return User.findOne(data.userId);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

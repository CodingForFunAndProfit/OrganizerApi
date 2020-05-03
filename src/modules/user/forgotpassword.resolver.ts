import { Resolver, Mutation, Arg } from 'type-graphql';
import { v4 } from 'uuid';
import path from 'path';

import { redis } from '../../utils/redis';
import { sendEmail } from '../../utils/sendEmail';
import { forgotPasswordPrefix } from '../../utils/redisPrefixes';
import { User } from '../../entity/user';
import { createForgotPasswordUrl } from '../../utils/createurls';
import { LoggerStream } from '../../config/winston';

@Resolver()
export class ForgotPasswordResolver {
    constructor(private readonly logger: LoggerStream) {}

    @Mutation(() => Boolean)
    public async forgotPassword(@Arg('email') email: string): Promise<boolean> {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return true;
            }

            const token = v4();
            await redis.set(
                forgotPasswordPrefix + token,
                user.id,
                'ex',
                60 * 60 * 24
            );

            const vars = { url: createForgotPasswordUrl(user.id) };
            await sendEmail(
                'forgotpassword',
                path.resolve(__dirname, 'templates'),
                email,
                vars
            );

            return true;
        } catch (error) {
            this.logger.error(error);
        }

        return false;
    }
}

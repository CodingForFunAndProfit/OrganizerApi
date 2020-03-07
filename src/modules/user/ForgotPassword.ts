import { Resolver, Mutation, Arg } from 'type-graphql';
import { v4 } from 'uuid';

import { redis } from '../../utils/redis';
import { sendEmail } from '../../utils/sendEmail';
import { forgotPasswordPrefix } from '../../utils/redisPrefixes';
import { User } from '../../entity/User';
import { createForgotPasswordUrl } from '../../utils/createEmailUrls';

@Resolver()
export class ForgotPasswordResolver {
    @Mutation(() => Boolean)
    public async forgotPassword(@Arg('email') email: string): Promise<boolean> {
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

        await sendEmail(email, createForgotPasswordUrl(user.id));

        return true;
    }
}

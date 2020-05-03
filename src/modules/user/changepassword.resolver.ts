import { Resolver, Mutation, Arg } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { redis } from '../../utils/redis';
import { forgotPasswordPrefix } from '../../utils/redisprefixes';
import { User } from '../../entity/user';
import { LoggerStream } from '../../config/winston';

@Resolver()
export class ChangePasswordResolver {
    constructor(private readonly logger: LoggerStream) {}

    @Mutation(() => Boolean)
    public async changePassword(
        @Arg('token') token: string,
        @Arg('password') password: string
    ): Promise<boolean> {
        try {
            const id = await redis.get(forgotPasswordPrefix + token);

            const user = await User.findOne({ id });

            if (!user) {
                return true;
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            await User.update({ id }, { password: hashedPassword });

            await redis.del(forgotPasswordPrefix + token);

            return true;
        } catch (error) {
            this.logger.error(error);
        }

        return false;
    }
}

import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { redis } from '../../utils/redis';
import { forgotPasswordPrefix } from '../../utils/redisPrefixes';
import { User } from '../../entity/User';
import { ChangePasswordInput } from './inputvalidation/ChangePasswordInput';
import { Context } from '../../types/Context';

@Resolver()
export class ChangePasswordResolver {
    @Mutation(() => User, { nullable: true })
    public async changePassword(
        @Arg('data')
        { token, password }: ChangePasswordInput,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const userId = await redis.get(forgotPasswordPrefix + token);

        if (!userId) {
            return null;
        }

        const user = await User.findOne(userId);

        if (!user) {
            return null;
        }

        await redis.del(forgotPasswordPrefix + token);

        user.password = await await bcrypt.hash(password, 12);

        await user.save();

        ctx.req.session!.userId = user.id;

        return user;
    }
}

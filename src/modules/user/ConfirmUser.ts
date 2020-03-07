import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../utils/redis';
import { confirmUserPrefix } from '../../utils/redisPrefixes';

@Resolver()
export class ConfirmUserResolver {
    @Mutation(() => Boolean)
    public async confirmUser(@Arg('token') token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

        await redis.del(token);

        return true;
    }
}

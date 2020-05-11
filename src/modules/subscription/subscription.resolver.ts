import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { Subscription } from '../../entity/subscription';
import { User } from '../../entity/user';
import { LoggerStream } from '../../config/winston';

@Resolver()
export class SubscriptionResolver {
    constructor(private readonly logger: LoggerStream) {}

    @Query(() => String)
    public async push() {
        return 'Push it baby';
    }

    @Mutation(() => Boolean)
    async sendSubscription(
        @Arg('sub', () => String) sub: string,
        @Arg('id', () => String) id: string
    ) {
        try {
            const user = await User.findOneOrFail({ id });
            if (!user) {
                this.logger.error('User not found');
                return false;
            }
            const subscription = await Subscription.create({
                user,
                subscription: sub,
            }).save();

            return true;
        } catch (error) {
            this.logger.error(error);
        }

        return false;
    }
}

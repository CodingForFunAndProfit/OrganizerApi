import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { Context } from '../../types/Context';

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    public async me(@Ctx() ctx: Context): Promise<User | undefined> {
        // console.log('Me Resolver userId: ' + (ctx.req as any).userId);

        if (!(ctx.req as any).userId) {
            return undefined;
        }
        return User.findOne((ctx.req as any).userId);
    }
}

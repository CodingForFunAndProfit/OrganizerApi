import {
    Resolver,
    Mutation,
    Arg,
    Ctx,
    Query,
    UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { Context } from '../../types/Context';
import {
    createAccessToken,
    createRefreshToken,
} from '../../utils/createTokens';
import { isAuth } from '../isAuthMiddleware';

@Resolver()
export class LoginResolver {
    @Mutation(() => User, { nullable: true })
    public async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: Context
    ): Promise<User | null> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return null;
        }

        if (!user.confirmed) {
            return null;
        }

        const refreshToken = createRefreshToken(user);
        const accessToken = createAccessToken(user);

        ctx.res.cookie('refresh-token', refreshToken);

        ctx.res.cookie('access-token', accessToken);
        return user;
    }
    @Mutation(() => Boolean)
    public async invalidateTokens(@Ctx() ctx: Context): Promise<boolean> {
        if (!(ctx.req as any).userId) {
            return false;
        }

        const user = await User.findOne((ctx.req as any).userId);

        if (!user) {
            return false;
        }
        await user.save();
        return true;
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    public async GoodBye(@Ctx() { payload }: Context) {
        return `your user id is: ${payload?.userId}`;
    }
}

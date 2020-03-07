import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { Context } from '../../types/Context';

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

        ctx.req.session!.userId = user.id;

        return user;
    }
}

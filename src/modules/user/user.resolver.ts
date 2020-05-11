import {
    Query,
    Resolver,
    Arg,
    Mutation,
    Ctx,
    UseMiddleware,
    InputType,
    Field,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { Service } from 'typedi';

import { User } from '../../entity/user';
import { UserInput } from './inputs/user.input';
import { RegisterInput } from './inputs/register.input';
import { Context } from '../../types/context';
import {
    createConfirmationUrl,
    confirmUserPrefix,
} from '../../utils/createurls';
import { sendEmail } from '../../utils/sendEmail';
import { redis } from '../../utils/redis';
import {
    createRefreshToken,
    createAccessToken,
} from '../../utils/createTokens';

import { isAuth } from '../../middleware/isAuthMiddleware';
import {
    sendRefreshToken,
    refreshTokenName,
} from '../../utils/sendRefreshtoken';
import { blacklistToken } from '../../utils/tokenBlacklist';

import { LoggerStream } from '../../config/winston';
import { verifyRefreshToken } from '../../utils/verifyToken';

import { PagedUsersResponse } from './types/pagesuserresponse.type';
import { LoginResponse } from './types/loginresponse.type';
import { PagingInput } from './inputs/paging.input';

// tslint:disable-next-line: max-classes-per-file
@InputType()
export class SortByInput {
    @Field()
    by: string;
    @Field()
    sort: string;
}
const createUserwPassword = async (
    email: string,
    password: string
): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        email,
        password: hashedPassword,
    }).save();

    return user;
};

@Service()
// tslint:disable-next-line: max-classes-per-file
@Resolver()
export class UserResolver {
    constructor(private readonly logger: LoggerStream) {}

    @Query(() => [User])
    public async users() {
        let users: User[];
        try {
            users = await User.find();
        } catch (error) {
            this.logger.error(error);
        }
        return users;
    }

    @Query(() => PagedUsersResponse, { nullable: true })
    public async pagedusers(
        @Arg('input', () => PagingInput) input: PagingInput,
        @Arg('sortby', () => SortByInput) sortby: SortByInput
    ) {
        const sortbycolumn = sortby.by;
        const direction = sortby.sort;

        try {
            const res = await User.createQueryBuilder('user')
                .skip(input.pageNo * input.pageSize)
                .take(input.pageSize)
                .orderBy(sortbycolumn, direction === 'asc' ? 'ASC' : 'DESC')
                .getManyAndCount();

            return { users: res[0], total: res[1] };
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }

    // 2: user gets created by an admin -> password strategy?
    @Mutation(() => Boolean)
    async createUser(@Arg('input', () => RegisterInput) input: RegisterInput) {
        try {
            const user = await createUserwPassword(input.email, input.password);
            return true;
        } catch (error) {
            this.logger.error(error);
            return false;
        }
    }

    @Query(() => User, { nullable: true })
    async user(@Arg('id', () => String) id: string): Promise<User> {
        try {
            const user = await User.findOne(id);
            if (user === undefined) {
                // throw new UserNotFoundError(id);
            } else {
                return user;
            }
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }

    @Mutation(() => Boolean)
    async updateUser(
        @Arg('id', () => String) id: string,
        @Arg('input', () => UserInput) input: UserInput
    ) {
        try {
            await User.update({ id }, input);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
        return true;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id', (type) => String) id: string) {
        try {
            const result = await User.delete({ id });
            // this.logger.info('Deletion result: ', result);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
        return true;
    }

    @Mutation(() => Boolean)
    async deleteUserByEmail(@Arg('email', (type) => String) email: string) {
        try {
            const result = await User.delete({ email });
            // this.logger.info('Deletion result: ', result);
        } catch (error) {
            this.logger.error(error);
            return false;
        }
        return true;
    }

    @Mutation(() => Boolean)
    public async UserRegister(
        @Arg('input')
        { email, password }: RegisterInput
    ): Promise<boolean> {
        let user;
        try {
            user = await createUserwPassword(email, password);
        } catch (error) {
            this.logger.error(error, null);
            return false;
        }
        const url = createConfirmationUrl(user.id);

        const vars = { url };

        sendEmail('userregistration', user.email, vars);
        return true;
    }

    @Mutation(() => Boolean)
    public async confirmUser(@Arg('token') token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: userId }, { confirmed: true });

        await redis.del(confirmUserPrefix + token);

        return true;
    }

    @Mutation(() => LoginResponse)
    public async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: Context
    ): Promise<LoginResponse> {
        const result = new LoginResponse();
        result.login = 'Failure';
        result.msg = 'There was a problem during authentication';
        result.accessToken = '1234';
        result.user = null;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            result.msg = 'User not found.'; // change later to user not found or password wrong
            return result;
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            result.msg = 'Password wrong.'; // change later to user not found or password wrong
            return result;
        }

        if (!user.confirmed) {
            result.msg = 'User not confirmed yet.'; // change later to user not found or password wrong
            return result;
        }

        const refreshToken = createRefreshToken(user.id);
        const accessToken = createAccessToken(user.id);

        sendRefreshToken(ctx.res, refreshToken);

        result.user = user;
        result.accessToken = accessToken;
        result.login = 'success';
        result.msg = 'User authenticated';

        return result;
    }

    @Query(() => User, { nullable: true })
    @UseMiddleware(isAuth)
    public async me(@Ctx() ctx: Context): Promise<User | undefined> {
        if (!ctx.payload?.userId) {
            return undefined;
        }

        return User.findOne(ctx.payload.userId);
    }

    @Mutation(() => Boolean)
    public async logout(@Ctx() ctx: Context): Promise<boolean> {
        try {
            blacklistToken(ctx.req.headers.authorization);
            sendRefreshToken(ctx.res, '');
            return true;
        } catch (error) {
            this.logger.error(error);
        }
        return true;
    }

    @Mutation(() => String, { nullable: true })
    public async refreshtoken(@Ctx() ctx: Context): Promise<string | null> {
        let accessToken: string;

        const token = ctx.req.cookies[refreshTokenName];

        if (!token) {
            this.logger.info('no refreshtoken found');
            return null;
        }
        let payload: any = null;
        try {
            payload = verifyRefreshToken(token);
        } catch (error) {
            this.logger.error(error);
            return null;
        }

        accessToken = createAccessToken(payload.userId);
        const refreshToken = createRefreshToken(payload.userId);
        sendRefreshToken(ctx.res, refreshToken);
        return accessToken;
    }
}

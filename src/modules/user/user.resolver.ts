import {
    Query,
    Resolver,
    Arg,
    Mutation,
    Ctx,
    UseMiddleware,
    ObjectType,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { Service } from 'typedi';

import { User, PagedUsersResponse } from '../../entity/user';
import { UserInput } from './user.input';
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

import { InputType, Field } from 'type-graphql';

@InputType()
export class PagingInput {
    @Field()
    pageSize!: number;
    @Field()
    pageNo!: number;
}
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

interface LoginResponse {
    accesToken: string;
    user: User;
}
// tslint:disable-next-line: max-classes-per-file

@Service()
// tslint:disable-next-line: max-classes-per-file
@Resolver()
export class UserResolver {
    // let usersPage:pagedResponse;

    constructor(private readonly logger: LoggerStream) {}

    @Query(() => [User])
    public async users() {
        // getConnection('test').getRepository(UserEntity).find();
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
        // console.log(sortby);
        // let users: User[];
        try {
            const res = await User.createQueryBuilder('user')
                .skip(input.pageNo * input.pageSize)
                .take(input.pageSize)
                .orderBy(sortbycolumn, direction === 'asc' ? 'ASC' : 'DESC')
                .getManyAndCount();
            /*
            const count = await User.findAndCount({
                skip: input.pageNo * input.pageSize,
                take: input.pageSize,
            });

            users = await User.find({
                skip: input.pageNo * input.pageSize,
                take: input.pageSize,
            });
            */

            return { users: res[0], total: res[1] };
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }
    // create
    // two use cases
    // 1: user registers
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

    // read
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

    // update
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

    // delete
    @Mutation(() => Boolean)
    async deleteUser(@Arg('id', (type) => String) id: string) {
        try {
            await User.delete({ id });
        } catch (error) {
            this.logger.error(error);
            return false;
        }
        return true;
    }

    @Mutation(() => Boolean)
    public async UserRegister(
        @Arg('input')
        input: RegisterInput
    ): Promise<boolean> {
        let user;
        try {
            user = await createUserwPassword(input.email, input.password);
        } catch (error) {
            this.logger.error(error, null);
            return false;
        }
        const url = createConfirmationUrl(user.id);
        this.logger.info(url);
        sendEmail(user.email, url);
        return true;
    }

    @Mutation(() => Boolean)
    public async confirmUser(@Arg('token') token: string): Promise<boolean> {
        const userId = await redis.get(confirmUserPrefix + token);

        if (!userId) {
            return false;
        }

        await User.update({ id: userId }, { confirmed: true });

        await redis.del(token);

        return true;
    }
    @Mutation(() => String, { nullable: true })
    public async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() ctx: Context
    ): Promise<string | null> {
        const user = await User.findOne({ where: { email } });
        // this.logger.info(null, user);
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

        const refreshToken = createRefreshToken(user.id);
        const accessToken = createAccessToken(user.id);

        sendRefreshToken(ctx.res, refreshToken);
        // ctx.res.cookie(refreshTokenName, refreshToken);
        // ctx.res.cookie('access-token', accessToken);
        // ctx.req.session!.userId = user.id;

        return accessToken;
    }
    /*
    @Mutation(() => Boolean)
    // tslint:disable-next-line: ban-types
    public async logout(@Ctx() ctx: Context): Promise<Boolean> {
        return new Promise((res, rej) =>
            ctx.req.session!.destroy(err => {
                if (err) {
                    console.log(err);
                    return rej(false);
                }
                ctx.res.clearCookie('qid');
                return res(true);
            })
        );
    }
    */
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
        blacklistToken(ctx.req.headers.authorization);
        sendRefreshToken(ctx.res, '');
        return true;
    }
    @Mutation(() => String, { nullable: true })
    public async refreshtoken(@Ctx() ctx: Context): Promise<string | null> {
        let accessToken: string;

        const token = ctx.req.cookies[refreshTokenName];
        // console.log(token);
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
        // console.log(payload);
        // remove this later, no need for the user-data here
        // user = await User.findOne(payload.userId);

        accessToken = createAccessToken(payload.userId);
        const refreshToken = createRefreshToken(payload.userId);
        sendRefreshToken(ctx.res, refreshToken);
        return accessToken;
    }
}

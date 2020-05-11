import { ObjectType, Field } from 'type-graphql';
import { User } from '../../../entity/user';

@ObjectType()
export class LoginResponse {
    @Field((type) => String)
    accessToken: string;
    @Field((type) => User, { nullable: true })
    user: User;
    @Field((type) => String)
    msg: string;
    @Field((type) => String)
    login: string;
}

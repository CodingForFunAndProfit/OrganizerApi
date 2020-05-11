import { ObjectType, Field, Int } from 'type-graphql';
import { User } from '../../../entity/user';

@ObjectType()
export class PagedUsersResponse {
    @Field((type) => [User])
    public users: User[];
    @Field((type) => Int)
    public total: number;
}

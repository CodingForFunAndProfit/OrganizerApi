import { InputType, Field } from 'type-graphql';

@InputType()
export class PagingInput {
    @Field()
    pageSize!: number;
    @Field()
    pageNo!: number;
}

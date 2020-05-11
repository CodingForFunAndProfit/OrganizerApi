import { InputType, Field } from 'type-graphql';

@InputType()
export class SortInput {
    @Field()
    column: string;
    @Field()
    direction: string;
}

import { InputType, Field } from 'type-graphql';
@InputType()
export class AccountInput {
    @Field()
    title!: string;
}

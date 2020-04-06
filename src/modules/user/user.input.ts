import { InputType, Field } from 'type-graphql';
import { MinLength } from 'class-validator';
@InputType()
export class UserInput {
    @Field()
    email!: string;
}

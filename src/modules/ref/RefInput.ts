import { InputType, Field } from 'type-graphql';
@InputType()
export class RefInput {
    @Field()
    title!: string;
}

import { InputType, Field } from 'type-graphql';
@InputType()
export class ActionInput {
    @Field()
    title!: string;
    @Field()
    done!: boolean;
}

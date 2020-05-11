import { InputType, Field } from 'type-graphql';
@InputType()
export class TransactionInput {
    @Field()
    title!: string;

    @Field()
    date!: Date;

    @Field()
    amount: number;

    @Field()
    currencyCode: string;
}

import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { createBaseResolver } from '../../common/base.resolver';
import { TransactionInput } from './inputs/transaction.input';
import { LoggerStream } from '../../config/winston';
import { Transaction, MICROFACTOR } from '../../entity/budget/transaction';
import { Account } from '../../entity/budget/account';

const BaseTransactionResolver = createBaseResolver(
    'Transaction',
    Transaction,
    TransactionInput,
    Transaction
);

@Resolver()
export class TransactionResolver extends BaseTransactionResolver {
    constructor(private readonly logger: LoggerStream) {
        super();
    }

    @Mutation(() => Transaction, { nullable: true })
    async addTransaction(
        @Arg('input', () => TransactionInput) input: TransactionInput,
        @Arg('id', () => String) id: string
    ): Promise<Transaction> | null {
        try {
            const account = await Account.findOne(id);
            if (!account) {
                // throw new Error('Account not found');
                this.logger.error('no account found');
            }

            const transaction = Transaction.create({
                account,
                title: input.title,
                date: input.date,
                amount: input.amount,
                currencyCode: input.currencyCode,
            }).save();
            return transaction;
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }
}

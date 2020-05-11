import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { createBaseResolver } from '../../common/base.resolver';
import { AccountInput } from './account.input';
import { LoggerStream } from '../../config/winston';
import { Account } from '../../entity/budget/account';
import { Transaction } from '../../entity/budget/transaction';

const BaseAccountResolver = createBaseResolver(
    'Account',
    Account,
    AccountInput,
    Account
);

@Resolver()
export class AccountResolver extends BaseAccountResolver {
    constructor(private readonly logger: LoggerStream) {
        super();
    }

    @Query(() => [Account])
    async getAllAccount() {
        /*
        const result = await Budget.find({ relations: ['accounts'] });
        console.log(result);
        return result;
        */
        return [];
    }

    @Query(() => [Account])
    async getAccount(@Arg('id', () => String) id: string) {
        const result = await Account.createQueryBuilder('account')
            .leftJoinAndSelect('account.finstates', 'finstate')
            .where('fin_state.accountId = :accountId', { accountId: id })
            .execute();
        console.log(result);
        return result;
    }
    /*
    const values = this.billRepository.createQueryBuilder("bill")
    .leftJoinAndSelect("bill.user", "user")
    .where("bill.accountBill LIKE :accountBill", {accountBill})
    .andWhere("user.id = :userId", {userId: user.id})
    .select(["user.name", "user.surname"])
    .execute();

    */
    @Query(() => [Transaction])
    async getTransactions(
        @Arg('id', () => String) id: string
    ): Promise<Transaction[]> | null {
        /*
        const result = await Budget.find({ relations: ['accounts'] });
        console.log(result);
        return result;
        */
        return [];
    }
    /*
    @Mutation(() => Account, { nullable: true })
    async addAccount(
        @Arg('input', () => AccountInput) input: AccountInput,
        @Arg('id', () => String) id: string
    ): Promise<Account> | null {
        try {
            const budget = await Budget.findOne(id);
            if (budget) {
                return Account.create({
                    title: input.title,
                    budget,
                }).save();
            }
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }
    */
}

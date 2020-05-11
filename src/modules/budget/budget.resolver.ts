import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Budget } from '../../entity/budget/budget';
import { BudgetInput } from './inputs/budget.input';
import { createBaseResolver } from '../../common/base.resolver';
import { AccountInput } from './account.input';
import { LoggerStream } from '../../config/winston';
import { Account } from '../../entity/budget/account';

const BaseBudgetResolver = createBaseResolver(
    'Budget',
    Budget,
    BudgetInput,
    Budget
);

@Resolver()
export class BudgetResolver extends BaseBudgetResolver {
    constructor(private readonly logger: LoggerStream) {
        super();
    }

    @Query(() => [Budget])
    async getAllBudget() {
        const result = await Budget.find({ relations: ['accounts'] });
        console.log(result);
        return result;
    }

    @Mutation(() => Budget, { nullable: true })
    async createBudget(@Arg('input', () => BudgetInput) input: BudgetInput) {
        try {
            const budget = await Budget.create(input).save();
            const cashaccount = await Account.create({
                budget,
                title: 'Cash',
            }).save();
            // await Budget.createQueryBuilder().relation(Budget, "accounts").of(budget).add(cashaccount)
            return budget;
        } catch (error) {
            this.logger.error(error);
        }

        return null;
    }

    @Mutation(() => Boolean)
    async deleteBudget(@Arg('id', () => String) id: string) {
        try {
            const budget = await Budget.find({ id });
            if (!budget) {
                return false;
            }
            // const result = await Budget.remove(budget);
            const result = await Budget.delete({ id });
            console.log(result);
            return true;
        } catch (error) {
            this.logger.error(error);
        }
        return false;
    }

    @Mutation(() => Account, { nullable: true })
    async addAccount(
        @Arg('input', () => AccountInput) input: AccountInput,
        @Arg('id', () => String) id: string
    ): Promise<Account> | null {
        try {
            const budget = await Budget.findOne(id);
            if (budget) {
                const account = await Account.create({
                    title: input.title,
                    budget,
                }).save();
                /*
                await Budget.createQueryBuilder()
                    .relation(Budget, 'accounts')
                    .of(budget)
                    .add(account);
                */
                return account;
            }
        } catch (error) {
            this.logger.error(error);
        }
        return null;
    }
}

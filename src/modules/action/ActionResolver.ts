import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Action } from '../../entity/Action';
import { ActionInput } from './ActionInput';

@Resolver()
export class ActionResolver {
    @Mutation(() => Action)
    async createAction(
        @Arg('options', () => ActionInput) options: ActionInput
    ) {
        const action = await Action.create(options).save();
        return action;
    }

    @Mutation(() => Boolean)
    async updateAction(
        @Arg('id', () => String) id: string,
        @Arg('options', () => ActionInput) options: ActionInput
    ) {
        await Action.update({ id }, options);
        return true;
    }

    @Mutation(() => Boolean)
    async deleteAction(@Arg('id', () => String) id: string) {
        await Action.delete({ id });
        return true;
    }

    @Query(() => [Action])
    async actions() {
        return await Action.find();
    }
}

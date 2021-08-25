import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import { Ref } from '../../entity/Ref';
import { RefInput } from './RefInput';

@Resolver()
export class RefResolver {
    @Mutation(() => Ref)
    async createRef(@Arg('input', () => RefInput) options: RefInput) {
        const ref = await Ref.create(options).save();
        return ref;
    }

    @Mutation(() => Boolean)
    async updateRef(
        @Arg('id', () => String) id: string,
        @Arg('input', () => RefInput) options: RefInput
    ) {
        await Ref.update({ id }, options);
        return true;
    }

    @Mutation(() => Boolean)
    async deleteRef(@Arg('id', () => String) id: string) {
        await Ref.delete({ id });
        return true;
    }

    @Query(() => [Ref])
    async refs() {
        return await Ref.find();
    }
}

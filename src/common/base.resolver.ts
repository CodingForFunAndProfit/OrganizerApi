import { ClassType, Resolver, Query, Arg, Mutation } from 'type-graphql';

export function createBaseResolver<T extends ClassType, U extends ClassType>(
    suffix: string,
    objectType: T,
    inputType: U,
    entity: any
) {
    @Resolver({ isAbstract: true })
    abstract class BaseResolver {
        @Mutation(() => objectType, { name: `create${suffix}` })
        async create(@Arg('input', () => inputType) input: any) {
            return entity.create(input).save();
        }

        @Mutation(() => Boolean, { name: `update${suffix}` })
        async update(
            @Arg('id', () => String) id: string,
            @Arg('options', () => inputType) input: any
        ) {
            const result = await entity.update({ id }, input);
            console.log(result);
            return true;
        }
        @Mutation(() => Boolean, { name: `delete${suffix}` })
        async delete(@Arg('id', () => String) id: string) {
            const result = await entity.delete({ id });
            console.log(result);
            return true;
        }

        @Query(() => [objectType], { name: `getAll${suffix}` })
        async getAll() {
            const result = await entity.find();
            console.log(result);
            return result;
        }
    }

    return BaseResolver;
}

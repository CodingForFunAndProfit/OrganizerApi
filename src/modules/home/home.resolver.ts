import { Query, Resolver } from 'type-graphql';

@Resolver()
export class HomeResolver {
    @Query(() => String)
    public async hello() {
        return 'Hello World';
    }
}

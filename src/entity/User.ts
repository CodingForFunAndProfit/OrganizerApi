import { Field, ObjectType, Root } from 'type-graphql';
import { Column, Entity } from 'typeorm';
import { Base } from '../common/Base';

@ObjectType()
@Entity()
export class User extends Base {
    @Field()
    @Column('text', { unique: true })
    public email!: string;

    @Column()
    public password!: string;

    @Field()
    @Column()
    public firstName!: string;

    @Field()
    @Column()
    public lastName!: string;

    @Column('bool', { default: false })
    public confirmed!: boolean;

    @Field()
    public name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }
}

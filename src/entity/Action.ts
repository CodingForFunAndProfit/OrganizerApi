import { Column, Entity } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Base } from '../common/Base';

@ObjectType()
@Entity()
export class Action extends Base {
    @Field()
    @Column()
    title!: string;

    @Field()
    @Column('boolean', { default: false })
    completed!: boolean;
}

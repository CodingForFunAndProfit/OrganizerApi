import { Column, Entity } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { Base } from '../common/base';

@ObjectType()
@Entity()
export class Ref extends Base {
    @Field()
    @Column()
    title!: string;

    @Field()
    @Column('text', { nullable: true })
    description!: string;

    @Field()
    @Column('text', { nullable: true })
    url!: string;
}

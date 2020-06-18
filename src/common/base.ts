import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity,
    UpdateDateColumn,
    Column,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Base extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Field()
    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created!: Date;

    @Field()
    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    changed!: Date;

    @Field()
    @Column('bool', { default: false })
    active!: boolean;
}

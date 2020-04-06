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

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created!: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    changed!: Date;

    @Column('bool', { default: false })
    active!: boolean;
}

import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Account } from './account';

// smallest amount is 0.000001 €/$/whatever
export const MICROFACTOR = 1000000;
@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Field((type) => Account)
    @ManyToOne((type) => Account, (account) => account.transactions, {
        onDelete: 'CASCADE',
    })
    account: Account;

    @Field()
    @Column('text', { unique: true })
    title: string;

    @Field()
    @Column('date')
    date: Date;

    @Field()
    @Column('bigint')
    amount: number;

    @Field()
    @Column('text')
    currencyCode: string;
}

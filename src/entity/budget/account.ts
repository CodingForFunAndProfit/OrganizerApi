import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Budget } from './budget';
import { Transaction } from './transaction';

@ObjectType()
@Entity()
export class Account extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Field((type) => Budget)
    @ManyToOne((type) => Budget, (budget) => budget.accounts, {
        onDelete: 'CASCADE',
    })
    budget: Budget;

    @Field((type) => [Transaction])
    @OneToMany((type) => Transaction, (transactions) => transactions.account)
    transactions: Transaction[];

    @Field()
    @Column('text')
    title: string;
}

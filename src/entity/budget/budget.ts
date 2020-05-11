import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Account } from './account';

@ObjectType()
@Entity()
export class Budget extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Field()
    @Column('text', { unique: true })
    title: string;

    @Field((type) => [Account])
    @OneToMany((type) => Account, (account) => account.budget, {
        onDelete: 'CASCADE',
    })
    accounts: Account[];
}

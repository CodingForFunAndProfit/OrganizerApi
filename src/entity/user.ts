import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Subscription } from './subscription';

// import { MinLength } from 'class-validator';
// validators didn't work the last time, try again
// import { IsEmailUnique } from '../api/validators/isEmailUnique.validator';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Field()
    @Column('text', { unique: true })
    email: string;

    @Column('text', { nullable: true })
    public password!: string;

    @Column('bool', { default: false })
    public confirmed!: boolean;

    @Field((type) => [Subscription])
    @OneToMany((type) => Subscription, (subscription) => subscription.user, {
        onDelete: 'CASCADE',
    })
    subscriptions: Subscription[];
}

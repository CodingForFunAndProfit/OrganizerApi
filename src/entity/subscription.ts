import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { User } from './user';

@ObjectType()
@Entity()
export class Subscription extends BaseEntity {
    @Field((type) => ID)
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Field((type) => User)
    @ManyToOne((type) => User, (user) => user.subscriptions, {
        onDelete: 'CASCADE',
    })
    public user: User;

    @Field()
    @Column({ type: 'jsonb' })
    subscription: string;
}

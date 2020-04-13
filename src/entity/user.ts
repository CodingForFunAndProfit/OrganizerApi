import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';

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
}

// tslint:disable-next-line: max-classes-per-file
@ObjectType()
export class PagedUsersResponse {
    @Field((type) => [User])
    public users: User[];
    @Field((type) => Int)
    public total: number;
}

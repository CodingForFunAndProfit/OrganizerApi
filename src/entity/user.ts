import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

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

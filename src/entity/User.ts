import { Field, ID, ObjectType, Root } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field()
    @Column('text', { unique: true })
    public email!: string;

    @Column()
    public password!: string;

    @Field()
    @Column()
    public firstName!: string;

    @Field()
    @Column()
    public lastName!: string;

    @Column('bool', { default: false })
    public confirmed!: boolean;

    @Field()
    public name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }
}

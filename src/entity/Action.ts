import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
export class Action extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column('boolean', { default: false })
    done!: boolean;
}

import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PasswordInput } from './password.input';
import { IsEmailUnique } from '../../../api/validators/isEmailUnique.validator';

@InputType()
export class RegisterInput extends PasswordInput {
    @Field()
    @IsEmail()
    public email!: string;
}

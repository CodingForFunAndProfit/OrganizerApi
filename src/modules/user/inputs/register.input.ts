import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { PasswordInput } from './password.input';
// import { IsEmailUnique } from './isEmailUnique';

@InputType()
export class RegisterInput extends PasswordInput {
    @Field()
    @IsEmail()
    // @IsEmailUnique({ message: 'email is already registered' })
    public email!: string;
}

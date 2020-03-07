import { InputType, Field } from 'type-graphql';
import { PasswordInput } from './PasswordInput';

@InputType()
export class ChangePasswordInput extends PasswordInput {
    @Field()
    public token!: string;
}

import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { User } from '../../entity/user';

@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments) {
        return User.findOne({ where: { email } }).then((user) => {
            if (user) {
                return false;
            }
            return true;
        });
    }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    // tslint:disable-next-line: ban-types
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint,
        });
    };
}

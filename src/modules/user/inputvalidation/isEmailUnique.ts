import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
// tslint:disable-next-line: class-name
export class isEmailUnique implements ValidatorConstraintInterface {
    public validate(email: string) {
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
            validator: isEmailUnique
        });
    };
}

import bcrypt from 'bcryptjs';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { createConfirmationUrl } from '../../utils/createEmailUrls';
// import { isAuth } from '../middleware/isAuth';
import { sendEmail } from '../../utils/sendEmail';
import { User } from '../../entity/User';
import { RegisterInput } from './inputvalidation/RegisterInput';

@Resolver()
export class RegisterResolver {
    @Mutation(() => User)
    public async register(@Arg('input')
    {
        firstName,
        lastName,
        email,
        password
    }: RegisterInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            password: hashedPassword,
            email
        }).save();
        const url = createConfirmationUrl(user.id);
        // console.log(url);
        sendEmail(email, url);
        return user;
    }
}

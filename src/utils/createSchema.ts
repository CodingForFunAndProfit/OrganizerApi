import { buildSchema } from 'type-graphql';
import { RegisterResolver } from '../modules/user/Register';
import { HelloResolver } from '../modules/hello/HelloWorld';
import { ConfirmUserResolver } from '../modules/user/ConfirmUser';
import { LoginResolver } from '../modules/user/Login';
import { LogoutResolver } from '../modules/user/Logout';
import { ForgotPasswordResolver } from '../modules/user/ForgotPassword';
import { MeResolver } from '../modules/user/Me';
import { ChangePasswordResolver } from '../modules/user/ChangePassword';

export const createSchema = () =>
    buildSchema({
        resolvers: [
            HelloResolver,
            RegisterResolver,
            ConfirmUserResolver,
            LoginResolver,
            LogoutResolver,
            ForgotPasswordResolver,
            MeResolver,
            ChangePasswordResolver
        ],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId; // !! casts to a boolean
        }
    });

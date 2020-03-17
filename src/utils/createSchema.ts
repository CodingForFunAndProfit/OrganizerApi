import { buildSchema } from 'type-graphql';
import { RegisterResolver } from '../modules/user/Register';
import { HelloResolver } from '../modules/hello/HelloWorld';
import { ConfirmUserResolver } from '../modules/user/ConfirmUser';
import { LoginResolver } from '../modules/user/Login';
import { LogoutResolver } from '../modules/user/Logout';
import { ForgotPasswordResolver } from '../modules/user/ForgotPassword';
import { MeResolver } from '../modules/user/Me';
import { ChangePasswordResolver } from '../modules/user/ChangePassword';
import { ActionResolver } from '../modules/action/ActionResolver';

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
            ChangePasswordResolver,
            ActionResolver,
        ],
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId; // !! casts to a boolean
        },
    });

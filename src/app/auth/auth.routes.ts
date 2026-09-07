import { Routes } from '@angular/router';
import { LoginPage } from './login/pages/login-page/login-page';
import { RegisterPage } from './register/pages/register-page/register-page';
import { ForgotPasswordPage } from './forgot-password/pages/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './reset-password/pages/reset-password-page/reset-password-page';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: LoginPage
    },

    {
        path: 'register',
        component: RegisterPage
    },

    {
        path: 'forgot-password',
        component: ForgotPasswordPage
    },

    {
        path: 'reset-password/:token',
        component: ResetPasswordPage
    }
];
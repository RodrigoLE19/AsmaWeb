import { Routes } from '@angular/router';
import { LoginPage } from './login/pages/login-page/login-page';
import { RegisterPage } from './register/pages/register-page/register-page';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginPage
    },

    {
        path: 'register',
        component: RegisterPage
    },
];
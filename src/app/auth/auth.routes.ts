import { Routes, UrlMatcher } from '@angular/router';
import { LoginPage } from './login/pages/login-page/login-page';
import { ForgotPasswordPage } from './forgot-password/pages/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './reset-password/pages/reset-password-page/reset-password-page';

const accesoMatcher: UrlMatcher = (segments) => {
    if (
        segments.length === 1 &&
        ['login', 'register'].includes(segments[0].path)
    ) {
        return { consumed: segments };
    }

    return null;
};

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        matcher: accesoMatcher,
        component: LoginPage
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
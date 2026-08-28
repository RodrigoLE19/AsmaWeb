import { Routes } from '@angular/router';
import { NewEvaluation } from './evaluation/pages/new-evaluation/new-evaluation';
import { ListEvaluation } from './evaluation/pages/list-evaluation/list-evaluation';
import { LoginPage } from './auth/login/pages/login-page/login-page';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    },

    {
        path: 'login-page',
        component: LoginPage
    },

    {
        path: 'new-evaluation',
        component: NewEvaluation
    },

    {
        path: 'list-evaluation',
        component: ListEvaluation
    }

];

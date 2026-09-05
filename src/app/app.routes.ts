import { Routes } from '@angular/router';
import { NewEvaluation } from './evaluation/pages/new-evaluation/new-evaluation';
import { ListEvaluation } from './evaluation/pages/list-evaluation/list-evaluation';
import { LoginPage } from './auth/login/pages/login-page/login-page';
import { authGuard } from './auth/guards/auth-guards';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    },

    {
        path: 'new-evaluation',
        component: NewEvaluation,
        canActivate: [authGuard]
    },

    {
        path: 'list-evaluation',
        component: ListEvaluation,
        canActivate: [authGuard]
    }

];

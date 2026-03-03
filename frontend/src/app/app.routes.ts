import { Routes } from '@angular/router';

import { Home } from './pages/public/home/home';
import { Register } from './pages/public/register/register';
import { Login } from './pages/public/login/login';
import { Dashboard } from './pages/private/dashboard/dashboard';
import { Products } from './pages/private/products/products';
import { Categories } from './pages/private/categories/categories';
import { Checkout } from './pages/public/checkout/checkout';
import { PageNotFound } from './pages/public/page-not-found/page-not-found';
import { Users } from './pages/private/users/users';

import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    { 
    path: 'home', 
    component: Home
    },
    { 
    path: 'login', 
    component:Login
    },
    { 
    path: 'register', 
    component:Register
    },
    { 
    path: 'checkout',
    component:Checkout
    },
     { 
    path: 'dashboard', 
    component:Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator', 'registered' ] }
    },
    { 
    path: 'dashboard/products',
    component:Products,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator', 'registered' ] }

    },
    { 
    path: 'dashboard/categories',
    component:Categories,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator' ] }

    },
    { 
    path: 'dashboard/users',
    component:Users,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin' ] }

    },
    { 
    path: '404', 
    component:PageNotFound
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' }

];

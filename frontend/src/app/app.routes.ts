import { Routes } from '@angular/router';

import { Home } from './pages/public/home/home';
import { Register } from './pages/public/register/register';
import { Login } from './pages/public/login/login';
import { Dashboard } from './pages/private/dashboard/dashboard';
import { Checkout } from './pages/public/checkout/checkout';
import { PageNotFound } from './pages/public/page-not-found/page-not-found';
import { CategoryList } from './pages/private/categories/category-list/category-list';
import { CategoryNewForm } from './pages/private/categories/category-new-form/category-new-form';
import { CategoryEditForm } from './pages/private/categories/category-edit-form/category-edit-form';
import { ProductsList } from './pages/private/products/products-list/products-list';
import { ProductEditForm } from './pages/private/products/product-edit-form/product-edit-form';
import { ProductNewForm } from './pages/private/products/product-new-form/product-new-form';
import { UsersList } from './pages/private/users/users-list/users-list';
import { UserEditForm } from './pages/private/users/user-edit-form/user-edit-form';
import { UserNewForm } from './pages/private/users/user-new-form/user-new-form';

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
    component:ProductsList,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator', 'registered' ] }

    },
     { 
    path: 'dashboard/product/new',
    component:ProductNewForm,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator', 'registered' ] }

    },
     { 
    path: 'dashboard/product/edit/:_id',
    component:ProductEditForm,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator', 'registered' ] }

    },
    { 
    path: 'dashboard/categories',
    component:CategoryList,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator' ] }
    },
    { 
    path: 'dashboard/category/new',
    component:CategoryNewForm,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator' ] }
    },
     { 
    path: 'dashboard/category/edit/:_id',
    component:CategoryEditForm,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin', 'colaborator' ] }
    },
    { 
    path: 'dashboard/users',
    component:UsersList,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin' ] }

    },
    { 
    path: 'dashboard/user/edit/:_id',
    component:UserEditForm,
    canActivate: [authGuard, roleGuard],
    data: { expectRoles: [ 'admin' ] }

    },
    { 
    path: 'dashboard/user/new',
    component:UserNewForm,
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

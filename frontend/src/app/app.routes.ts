import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Error } from './pages/error/error';
import { Register } from './pages/register/register';

export const routes: Routes = [
    { 
    path: 'home', 
    component: Home
    },
    { 
    path: 'products',
    component:Products
    },
    {
    path: 'product-detail',
    component:ProductDetail
    },
    { 
    path: 'cart',
    component:Cart
    },
    { 
    path: 'checkout',
    component:Checkout
    },
    { 
    path: 'register', 
    component:Register
    },
    { 
    path: '404', 
    component:Error
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' }

];

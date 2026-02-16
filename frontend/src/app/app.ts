import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Home } from './pages/home/home';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Products } from './pages/products/products';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    RouterOutlet, 
    Cart,
    Checkout,
    Home,
    ProductDetail,
    Products
  ]
})
export class App {
  protected readonly title = signal('frontend');
}

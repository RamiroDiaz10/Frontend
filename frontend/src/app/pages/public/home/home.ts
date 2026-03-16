import { Component } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable, BehaviorSubject, Subscription, switchMap, map } from 'rxjs';

import { HttpProducts } from '../../../core/service/http-products';
import { DataProduct, ResponseProducts } from '../../../models/products.models';
import { HttpCar } from '../../../core/service/http-car';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  public products: Observable<DataProduct[]> = new Observable<DataProduct[]>();

  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

  constructor(
    private httpProducts: HttpProducts,
    private httpCar: HttpCar
  ) {}


  ngOnInit(): void {
    this.products = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpProducts.getProducts()),
      map(response => response.products)
    );
  }

  addToCart(product: DataProduct): void {
      // Aquí puedes agregar la lógica para añadir el producto al carrito
      this.httpCar.updateToCart(product, +1);

  }

  ngOnDestroy(): void {
    console.log('Home component destroyed');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
  }
}

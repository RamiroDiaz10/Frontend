import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';

import { DataProduct } from '../../../models/products.models';
import { HttpCar } from '../../../core/service/http-car';
import { HttpProducts } from '../../../core/service/http-products';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-public-products',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './public-products.html',
  styleUrl: './public-products.css',
})
export class PublicProducts {
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

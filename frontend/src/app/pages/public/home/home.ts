import { Component } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable, BehaviorSubject, Subscription, switchMap, map } from 'rxjs';

import { HttpProducts } from '../../../core/service/http-products';
import { DataProduct, ResponseProducts } from '../../../models/products.models';
import { HttpCar } from '../../../core/service/http-car';
import { HttpCategories } from '../../../core/service/http-categories';
import { DataCategory } from '../../../models/category-model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  public products: Observable<DataProduct[]> = new Observable<DataProduct[]>();
  public categories: Observable<DataCategory[]> = new Observable<DataCategory[]>();
  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

  constructor(
    private httpProducts: HttpProducts,
    private httpCategories : HttpCategories,
    private httpCar: HttpCar
  ) {}


  ngOnInit(): void {
    this.products = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpProducts.getProducts()),
      map(response => response.products)
    );

    this.categories = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpCategories.getCategories()),
      map(response => response.categories)
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

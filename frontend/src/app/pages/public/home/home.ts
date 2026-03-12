import { Component } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable, BehaviorSubject, Subscription, switchMap } from 'rxjs';

import { HttpProducts } from '../../../core/service/http-products';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  public products: Observable<any[]> = new Observable<any[]>();

  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

  constructor(
    private httpProducts: HttpProducts
  ) {}


  ngOnInit(): void {
    this.products = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpProducts.getProducts())
    );
    console.log(this.products, 'products');
  }

  onSubmit() {
    this.refreshProductsTrigger$.next();
  }

  ngOnDestroy(): void {
    console.log('Home component destroyed');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
  }
}

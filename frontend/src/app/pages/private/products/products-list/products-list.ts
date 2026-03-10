import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';

import { HttpProducts } from '../../../../core/service/http-products';

@Component({
  selector: 'app-products-list',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  public products: Observable<any[]> = new Observable<any[]>();
  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

  constructor(
    private httpProducts: HttpProducts,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpProducts.getProducts())
    );
  }

  onEdit(_id: string): void {
    this.router.navigateByUrl(`/dashboard/product/edit/${_id}`);
  }

  deleteProduct(_id: string): void {
    this.subscription = this.httpProducts.deleteProduct(_id).subscribe({
      next: (response) => {
        console.log(response);
        this.refreshProductsTrigger$.next();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



}

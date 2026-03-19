import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

import { HttpProducts } from '../../../../core/service/http-products';
import { ResponseProducts, DataProduct } from '../../../../models/products.models';

@Component({
  selector: 'app-products-list',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  public products: Observable<DataProduct[]> = new Observable<DataProduct[]>();
  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

  constructor(
    private httpProducts: HttpProducts,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpProducts.getProducts()),
      map(response => response.products || [])
    );
  }

  onEdit(_id: string): void {
    this.router.navigateByUrl(`/dashboard/product/edit/${_id}`);
  }

  deleteProduct(_id: string): void {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor:" #E8A598",
      cancelButtonColor: "#8B3A36",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

          this.subscription = this.httpProducts.deleteProduct(_id).subscribe({
          next: (response) => {
            console.log(response);
            this.refreshProductsTrigger$.next();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
          }
    });

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          confirmButtonColor:" #E8A598",
        });
      }
    });

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }



}

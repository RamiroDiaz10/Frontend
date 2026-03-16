import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

import { HttpCar } from '../../../core/service/http-car';
import { CarItem } from '../../../models/car-item.model';
import { DataProduct } from '../../../models/products.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, AsyncPipe, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  public carItem: Observable<CarItem[]> = new Observable<CarItem[]>();
  public totalItems$: Observable<number> = new Observable<number>();
  public subTotalCart$: Observable<number> = new Observable<number>();
  public totalCart$: Observable<number> = new Observable<number>();
  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private subscription!: Subscription;

    constructor(
      private httpCar: HttpCar,

    ){}

    ngOnInit(): void {
      this.carItem = this.refreshProductsTrigger$.asObservable().pipe(
        switchMap(() => this.httpCar.getCarItems())
      )
      this.totalItems$ = this.carItem.pipe(
        map(items => items.reduce((acu, item) => acu + item.quantity, 0 ))
      );
      this.subTotalCart$ = this.httpCar.subTotalCart();

      this.totalCart$ = this.httpCar.totalCart();

      
    }


    onAdd(product: DataProduct, chance: number): void{
      this.httpCar.updateToCart( product, chance );
    }

    onDelete(product: DataProduct, chance: number): void {
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
            this.httpCar.updateToCart( product,  chance);
            Swal.fire({
              title: "Deleted!",
              text: "Your product has been deleted.",
              icon: "success"
            });
          }
        });
    }

    onSubtract(product: DataProduct, chance: number): void {
      this.httpCar.updateToCart( product, chance );
    }

    ngOnDestroy(): void {
      console.log("componente desruido");
      if(this.subscription){
        this.subscription.unsubscribe();
      }
      
    }



}

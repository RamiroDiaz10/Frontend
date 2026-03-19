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

  public filteredProducts$: Observable<DataProduct[]> = new Observable<DataProduct[]>();
  private filterTrigger$ = new BehaviorSubject<string | null>(null);
  private subscription!: Subscription;

  constructor(
    private httpProducts: HttpProducts,
    private httpCategories : HttpCategories,
    private httpCar: HttpCar
  ) {}


  ngOnInit(): void {

    this.categories = this.refreshProductsTrigger$.asObservable().pipe(
      switchMap(() => this.httpCategories.getCategories()),
      map(response => response.categories)
    );

    this.filteredProducts$ = this.filterTrigger$.asObservable().pipe(
      switchMap((categoryId: string | null) => 
        this.httpProducts.getProducts().pipe( 
          map(response => {
            const allProducts = response.products;
            // Filtramos en el cliente basándonos en el ID que emitió el trigger
            return categoryId 
              ? allProducts.filter(p => p.category?._id === categoryId) // <-- Verifica si es 'idCategory' o 'categoryId' en tu modelo
              : allProducts;
          })
        )
      )
    )

      //  los productos (Sección "LAS MÁS PEDIDAS")
    // Este no escucha al filterTrigger$, por eso no cambia.
    this.products = this.httpProducts.getProducts().pipe(
      map(response => response.products)
    );
  }

  // Método para el HTML
  changeCategory(id: string | null): void {
    this.filterTrigger$.next(id);
  }

  // Getter para que el HTML sepa cuál es la categoría seleccionada
  get selectedCategoryId(): string | null {
    return this.filterTrigger$.value;
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

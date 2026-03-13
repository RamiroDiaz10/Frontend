import { Injectable } from '@angular/core';

import { HttpProducts } from './http-products';
import { DataProduct, ResponseProducts } from '../../models/products.models';
import { CarItem } from '../../models/car-item.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class HttpCar {
  carItems: CarItem[] = [];  // Aquí almacenaremos los productos añadidos al carrito

  constructor(
    private httpProducts: HttpProducts,
  ) {}

  private saveCarItems( cart: CarItem[] ): void {             // Guardamos el carrito en localStorage
    localStorage.setItem('carItems', JSON.stringify(cart));
  }

  private getCarItems(): CarItem[] {                          // Obtenemos el carrito desde localStorage y lo parseamos a un array de CarItem
    const storedCarItems = localStorage.getItem('carItems');
    return storedCarItems ? JSON.parse(storedCarItems) : [];
  }

  addToCart(product: DataProduct): void {   // Método para añadir un producto al carrito
    this.carItems = this.getCarItems();     // Cargamos el carrito actual desde localStorage 

    const existingItemIndex = this.carItems.find((item: CarItem) =>{  // Buscamos si el producto ya está en el carrito
      return item.product._id === product._id;
    }); 

    if (product.stock === undefined) {    // Si el producto no tiene stock definido, mostramos un mensaje de error y no lo añadimos al carrito
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Not added to cart: the product does not have defined stock.",
      });
      return;

    }

    if (existingItemIndex ) {   

      if (existingItemIndex.quantity + 1 <= product.stock) {  // Si el producto ya está en el carrito, incrementamos la cantidad, pero solo si no supera el stock disponible
        existingItemIndex.quantity ++;
      } else {
       Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Not added to cart: the ${product.name} does not have enough stock.`,
      });
      return;
      }
    
    } else {

      if(product.stock >= 1) {    // Si el producto no está en el carrito, lo añadimos con una cantidad de 1, pero solo si hay stock disponible
        const newCarItem: CarItem = {  // Creamos un nuevo CarItem con el producto y una cantidad de 1
          product: product,
          quantity: 1,
        };
        this.carItems.push(newCarItem);   // Añadimos el nuevo producto al carrito
      }else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Not added to cart: the ${product.name} does not have enough stock.`,
        });
        return;
      }

    }
    this.saveCarItems(this.carItems);  // Guardamos el carrito actualizado en localStorage
  }

}


import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { DataProduct } from '../../models/products.models';
import { CarItem } from '../../models/car-item.model';

@Injectable({
  providedIn: 'root',
})
export class HttpCar {

  // Creamos un Subject que maneje la lista de productos
  private cart$ = new BehaviorSubject<CarItem[]>(this.getInitialCart());

  constructor() {}

  // Función privada para leer el localStorage al iniciar
  private getInitialCart(): CarItem[] {
    const stored = localStorage.getItem('carItems');
    return stored ? JSON.parse(stored) : [];
  }

  // Ahora devolvemos un Observable para que el componente se suscriba
  getCarItems(): Observable<CarItem[]> {
    return this.cart$.asObservable();
  }

  updateToCart(product: DataProduct, chance: number): void {
    // 1. Obtenemos el valor actual (Copia por referencia)
    let currentCart = this.cart$.getValue(); 

    // 2. Buscamos si el producto ya existe
    const existingItem = currentCart.find(item => item.product._id === product._id);

    if (existingItem) {
      // Si existe, sumamos el cambio (chance puede ser +1 o -1)
      const newQuantity = existingItem.quantity + chance;

      // Validación de Stock (Solo si sumamos)
      if (chance > 0 && newQuantity > (product.stock || 0)) {
        this.showError(`Solo hay ${product.stock} en el stock de ${product.name}`);
        return;
      }

      existingItem.quantity = newQuantity;
    } else if (chance > 0) {
      // Si no existe y el cambio es positivo, lo añadimos
      currentCart.push({ product, quantity: chance });
    }

    const removeItem = currentCart.filter(item => item.quantity <= 0 )
        //validar si esa esa lista  tiene item   
        if(removeItem.length > 0){
          //Filtramos los que quedaron en 0 o menos
          // Debemos SOBREESCRIBIR el array con el resultado del filtro
          currentCart = currentCart.filter(item => item.quantity > 0);
        }

    // 4. Persistencia y Notificación
    localStorage.setItem('carItems', JSON.stringify(currentCart));
    this.cart$.next(currentCart); //avisa que el carrito cambio, actualiza.
  }

  private showError(msg: string) {
    Swal.fire({ icon: 'error', title: 'Oops...', confirmButtonColor:" #E8A598", text: msg });
  }

  subTotalCart(): Observable<number> {
    return this.cart$.pipe(
      map(items => 
        items.reduce((total, item) => {
          // Usamos || 0 por seguridad, por si el precio no viene definido
          const price = item.product.price || 0;
          return total + (price * item.quantity);
        }, 0)
      )
    );
  }

  totalCart(): Observable<number> {
    return this.cart$.pipe(
      map(items => 
        items.reduce((total, item) => {
          // Usamos || 0 por seguridad, por si el precio no viene definido
          const price = item.product.price || 0;
          return total + ((price * item.quantity) * 0.9);
        }, 0)
      )
    );
  }

}
  
  
  // .....logica estatica: logica video......//...............................
  
    // updateToCart (product: DataProduct, chance: number){
  
    //   let currentCart = this.cart$.getValue(); // Obtenemos el valor actual
  
    //   //validamos que la cantidad del producto este disponible
    //   if(product.stock && Math.abs(chance) <= product.stock ){
    //     //filtramos por id para que se sumen al cartItem productos iguales no como objetos diferentes
    //     const existingItem = currentCart.find( item => item.product._id === product._id)
    //     //validar si el productos esta en el carrito y sumar o restar 
    //     if(existingItem){
    //       existingItem.quantity = (chance === 0) ? 0 : existingItem.quantity + chance;
    //     }else{
    //       currentCart.push({ product, quantity: chance });
    //     }
  
        
    //     //filtrar items con cantidad 0, y agruparlos en una listas 
    //     const removeItem = currentCart.filter((item) => item.quantity <= 0 )
    //     //validar si esa esa lista  tiene item   
    //     if(removeItem.length > 0){
    //       currentCart = currentCart.filter((item) => item.quantity > 0)
    //     }
    //   }
      
    //   localStorage.setItem('carItems', JSON.stringify(currentCart));
    //   this.cart$.next(currentCart);
    // }
    // }




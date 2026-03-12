import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { DataProduct, ResponseProducts } from '../../models/products.models';
import { ResponseApi } from '../../models/response.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class HttpProducts {


    constructor(
      private http: HttpClient
    ) {}
   
  createProduct(productData: DataProduct):Observable<string> {
    return this.http.post<ResponseApi<DataProduct>>('http://localhost:3000/api/v1/products', productData)
    .pipe(
      map((response: any) => {
        console.info(response);
        return response;
      }),
      catchError((error) => {
        // IMPORTANTE: throwError hace que el componente ejecute el bloque 'error:'
        // Enviamos el error real hacia el componente
        return throwError(() => error)
      })
    );

  }

  getProducts(): Observable<DataProduct[]> {
    return this.http.get<ResponseProducts>('http://localhost:3000/api/v1/products')
      .pipe(
        map((response) => {
          console.log(response);
          return response.products || [];
        }),
        catchError((error) => {
          console.error('Error fetching products:', error);
          return of([]);
        })
      );
  }

  getProductById(_id: string): Observable<ResponseApi<DataProduct>> {
    return this.http.get<ResponseApi<DataProduct>>(`http://localhost:3000/api/v1/products/${_id}`);
  }

  deleteProduct(_id: string): Observable<string> {
    return this.http.delete<ResponseApi<DataProduct>>(`http://localhost:3000/api/v1/products/${_id}`)
      .pipe(
        map((response) => {
          console.log(response);
          return response.msg || 'Product deleted successfully';
        }),
        catchError((error) => {
          console.error('Error deleting product:', error);
          return of(error.error?.msg || 'Error: servidor fallando');
        })
      );  
  }

  updateProduct(_id: string, productData: DataProduct[]): Observable<ResponseProducts> {
    return this.http.patch<ResponseProducts>(`http://localhost:3000/api/v1/products/${_id}`, productData);
  }
}

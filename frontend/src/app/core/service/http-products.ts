import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { DataProduct, ResponseProducts } from '../../models/products.models';
import { ResponseApi } from '../../models/response.model';

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
      map((response) => {
        console.info(response);
        return response.msg || 'Product created successfully';
      }),
      catchError((error) => {
        if (error.error?.msg) {
          return of(error.error.msg);
        }
        return of(error.error?.msg ||'Error: servidor fallando');
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

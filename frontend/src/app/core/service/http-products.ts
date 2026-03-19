import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { DataProduct, ResponseProducts } from '../../models/products.models';
import { ResponseApi } from '../../models/response.model';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpProducts {
  private apiUrl: string = `${environment.apiUrl}/products`;

    constructor(
      private http: HttpClient,
    ) {}
   
  createProduct(productData: DataProduct):Observable<ResponseProducts> {
    return this.http.post<ResponseProducts>(this.apiUrl, productData)
    .pipe(
      map((response: ResponseProducts) => {
        return response;
      }),
      catchError((error) => {
        // IMPORTANTE: throwError hace que el componente ejecute el bloque 'error:'
        // Enviamos el error real hacia el componente
        return throwError(() => error);
      })
    );

  }

  getProducts(): Observable<ResponseProducts> {
    return this.http.get<ResponseProducts>(this.apiUrl)
      .pipe(
        map((response: ResponseProducts) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error );
        })
      );
  }

  getProductById(_id: string): Observable<ResponseApi<ResponseProducts>> {
    return this.http.get<ResponseApi<ResponseProducts>>(`${this.apiUrl}/${_id}`);
  }

  deleteProduct(_id: string): Observable<ResponseProducts> {
    return this.http.delete<ResponseProducts>(`${this.apiUrl}/${_id}`)
      .pipe(
        map((response: ResponseProducts) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => error );
        })
      );  
  }

  updateProduct(_id: string, productData: DataProduct[]): Observable<ResponseProducts> {
    return this.http.patch<ResponseProducts>(`${this.apiUrl}/${_id}`, productData);
  }
}

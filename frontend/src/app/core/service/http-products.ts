import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpProducts {
    private http = inject(HttpClient);
   
  createProduct(productData: any):Observable<string> {
    return this.http.post('http://localhost:3000/api/v1/products', productData)
    .pipe(
      map((response: any) => {
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
}

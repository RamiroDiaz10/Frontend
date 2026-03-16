import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of, Observable, tap, throwError } from 'rxjs';

import { DataCategory, ResponseCategories } from '../../models/category-model';
import { ResponseApi } from '../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class HttpCategories {
  private urlApi = 'http://localhost:3000/api/v1/category'

  constructor(
  private http: HttpClient

  ) {}
   
  createCategory(categoryData: DataCategory):Observable<ResponseCategories> {
    return this.http.post<ResponseCategories>(this.urlApi, categoryData)
    .pipe(
      map((response: ResponseCategories) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {
       return throwError(() => error)
      })
    );
  }

  getCategories(): Observable<ResponseCategories> {
      return this.http.get<ResponseCategories>(this.urlApi)
      .pipe(
        map((response: ResponseCategories) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching categories:', error);
         return throwError(() => error);

        })
      );
        
  }

  getCategoryById(_id: string): Observable<ResponseCategories> {
    return this.http.get<ResponseCategories>(`${this.urlApi}/${_id}`)
  }

  deleteCategory(_id: string): Observable<ResponseCategories> {
    return this.http.delete<ResponseCategories>(`${this.urlApi}/${_id}`)
      .pipe(
        map((response: ResponseCategories) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.error('Error deleting category:', error);
        return throwError(() => error);

        })
      );
  }

  updateCategory(_id: string, categoryData: DataCategory): Observable<ResponseCategories> {
    return this.http.patch<ResponseCategories>(`${this.urlApi}/${_id}`, categoryData);
    
  }

}


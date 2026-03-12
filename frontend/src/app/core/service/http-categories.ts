import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of, Observable, tap } from 'rxjs';

import { DataCategory, ResponseCategories } from '../../models/category-model';
import { ResponseApi } from '../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class HttpCategories {

  constructor(
  private http: HttpClient

  ) {}
   
  createCategory(categoryData: DataCategory):Observable<string> {
    return this.http.post<ResponseApi<DataCategory>>('http://localhost:3000/api/v1/category', categoryData)
    .pipe(
      map((response) => {
        console.log(response);
        return response || 'Category created successfully';
      }),
      catchError((error) => {
        if (error.error?.msg) {
          return of(error.error.msg);
        }
        return of(error.error?.msg ||'Error: servidor fallando');
      })
    );
  }

  getCategories(): Observable<DataCategory[]> {
      return this.http.get<ResponseCategories>('http://localhost:3000/api/v1/category')
      .pipe(
        map((response) => {
          console.log(response);
          return response.categories || [];
        }),
        catchError((error) => {
          console.error('Error fetching categories:', error);
          return of([]);
        })
      );
        
  }

  getCategoryById(_id: string): Observable<ResponseApi<DataCategory>> {
    return this.http.get<ResponseApi<DataCategory>>(`http://localhost:3000/api/v1/category/${_id}`)
  }

  deleteCategory(_id: string): Observable<string> {
    return this.http.delete<ResponseApi<DataCategory>>(`http://localhost:3000/api/v1/category/${_id}`)
      .pipe(
        map((response) => {
          console.log(response);
          return response.msg || 'Category deleted successfully';
        }),
        catchError((error) => {
          console.error('Error deleting category:', error);
          return of(error.error?.msg || 'Error: servidor fallando');
        })
      );
  }

  updateCategory(_id: string, categoryData: DataCategory): Observable<ResponseCategories> {
    return this.http.patch<ResponseCategories>(`http://localhost:3000/api/v1/category/${_id}`, categoryData);
    
  }

}


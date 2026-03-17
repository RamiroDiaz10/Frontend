import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { DataUser, ResponseUsers } from '../../models/data-user.model';

@Injectable({
  providedIn: 'root',
})
export class HttpUsers {
  private apiUrl = 'http://localhost:3000/api/v1/users'; 

  constructor(
    private http: HttpClient,
    
  ){}
  
  createUser(userData: DataUser): Observable<ResponseUsers> {
    return this.http.post<ResponseUsers>(this.apiUrl, userData)
      .pipe(
        map((response: ResponseUsers) => response),
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  // Obtener todos los usuarios
  getUsers(): Observable<ResponseUsers> {
    return this.http.get<ResponseUsers>(this.apiUrl)
      .pipe(
        map((response: ResponseUsers) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return throwError(() => error);

        })
      );
    
  }

  // Obtener un usuario por ID
  getUserById(id: string): Observable<ResponseUsers> {
    return this.http.get<ResponseUsers>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response: ResponseUsers) => response), 
        catchError((error) => {
          console.error('Error fetching user:', error);
          return throwError(() => error);

        })
      );
  }

  // Actualizar un usuario
  updateUser(id: string, userData: DataUser): Observable<ResponseUsers> {
    return this.http.patch<ResponseUsers>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        map((response: ResponseUsers) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  // Eliminar un usuario
  deleteUser(id: string): Observable<ResponseUsers> {
    return this.http.delete<ResponseUsers>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}

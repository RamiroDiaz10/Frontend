import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { DataAuthUser } from '../../models/user-model';
import { ResponseApi } from '../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class HttpUsers {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/users'; // Cambia a '/user' si tu backend usa singular

  // Obtener todos los usuarios
  getUsers(): Observable<DataAuthUser[]> {
    return this.http.get<{ users: DataAuthUser[] }>(this.apiUrl)
      .pipe(
        map((response) => response.users || []),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return of([]);
        })
      );
  }

  // Obtener un usuario por ID
  getUserById(id: string): Observable<DataAuthUser | null> {
    return this.http.get<ResponseApi<DataAuthUser>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.data || response.user || null), // Usar .data o .user según tu backend
        catchError((error) => {
          console.error('Error fetching user:', error);
          return of(null);
        })
      );
  }

  // Actualizar un usuario
  updateUser(id: string, userData: Partial<DataAuthUser>): Observable<string> {
    return this.http.patch<ResponseApi<DataAuthUser>>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        map((response) => response.msg || 'User updated successfully'),
        catchError((error) => of(error.error?.msg || 'Error al actualizar usuario'))
      );
  }

  // Eliminar un usuario
  deleteUser(id: string): Observable<string> {
    return this.http.delete<ResponseApi<DataAuthUser>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.msg || 'User deleted successfully'),
        catchError((error) => of(error.error?.msg || 'Error al eliminar usuario'))
      );
  }
}

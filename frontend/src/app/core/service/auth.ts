import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { DataAuthUser } from '../../models/user-model';
import { ResponseApi } from '../../models/response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  // Guardamos en memoria los datos del usuario
  private authUserData: null | DataAuthUser = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =========================
  // MÉTODOS LOCAL STORAGE
  // =========================

  /**
   * Guarda el token en localStorage
   */
  private saveToken(token: string) {
    localStorage.setItem('X-Token', token);
  }

  /**
   * Obtiene el token desde localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('X-Token');
  }

  /**
   * Elimina el token del localStorage
   */
  private removeToken() {
    localStorage.removeItem('X-Token');
  }

  /**
   * Guarda el usuario en localStorage
   */
  private saveUser(user: DataAuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.authUserData = user;
  }

  /**
   * Obtiene el usuario desde localStorage
   */
  getUser(): DataAuthUser | null {

    if (!this.authUserData) {

      const storageUser = localStorage.getItem('user');

      if (storageUser) {
        this.authUserData = JSON.parse(storageUser);
      }
    }

    return this.authUserData;
  }

  /**
   * Elimina el usuario del localStorage
   */
  private removeUser() {
    localStorage.removeItem('user');
    this.authUserData = null;
  }

  // =========================
  // REGISTER
  // =========================

  registerNewUser(newUser: DataAuthUser): Observable<string> {

    return this.http
      .post<ResponseApi>('http://localhost:3000/api/v1/auth/register', newUser)

      .pipe(

        // transformamos la respuesta
        map((response: ResponseApi) => {
          return response.msg!;
        }),

        // manejo de errores
        catchError((err) => {

          if (err.error?.msg) {
            return of(err.error.msg);
          }

          return of('Error: servidor fallando');
        })

      );
  }

  // =========================
  // LOGIN
  // =========================

  loginUser(credentials: DataAuthUser): Observable<string> {

    return this.http
      .post<ResponseApi>('http://localhost:3000/api/v1/auth/login', credentials)

      .pipe(

        // tap sirve para ejecutar lógica sin modificar el observable
        tap((data: ResponseApi) => {

          // guardamos usuario si existe
          if (data.user) {
            this.saveUser(data.user);
          }

          // guardamos token
          if (data.token) {
            this.saveToken(data.token);
          }

        }),

        map((response) => {
          return response.msg!;
        }),

        catchError((err) => {

          if (err.error?.msg) {
            return of(err.error.msg);
          }

          return of('Error: servidor fallando');

        })
      );
  }

  // =========================
  // LOGOUT
  // =========================

  logout(): Observable<boolean> {

    this.removeUser();
    this.removeToken();

    // redirigimos al login
    this.router.navigate(['/home']);

    return of(true);
  }

  // =========================
  // VERIFY TOKEN
  // =========================

  verifyUser(): Observable<boolean> {

    const token = this.getToken();

    // si no hay token el usuario no está autenticado
    if (!token) {
      return of(false);
    }

    const headers = new HttpHeaders().set('X-Token', token);

    return this.http
      .get<ResponseApi>('http://localhost:3000/api/v1/auth/renew-token', { headers })

      .pipe(

        map((response) => {

          // actualizamos token y usuario
          if (response.token) {
            this.saveToken(response.token);
          }

          if (response.user) {
            this.saveUser(response.user);
          }

          return true;
        }),

        catchError(() => {

          // si falla eliminamos datos
          this.removeToken();
          this.removeUser();

          return of(false);
        })

      );
  }

  // =========================
  // VALIDAR ROLES
  // =========================

  hasRole(expectRoles: string[]): boolean {

    const user = this.getUser();

    if (!user) return false;

    return expectRoles.includes(user.role ?? '');
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { ResponseApi } from '../../models/response.model';
import { DataAuthUser, ResponseUser } from '../../models/user-model';
import { HttpCar } from './http-car';
import { environment } from '../../../environments/environment';
import { DataUser, ResponseUsers } from '../../models/data-user.model';
import { ConfirmModel } from '../../models/confirm-model';

@Injectable({
  providedIn: 'root'
})

export class Auth {
  private baseUrl: string = environment.apiUrl

  // Guardamos en memoria los datos del usuario
  private currentUser = new BehaviorSubject<null | Partial<DataUser>>(null);
  public currentUser$ = this.currentUser.asObservable();
  public authUserData: null | DataAuthUser = null;
  

  constructor(
    private http: HttpClient,
    private router: Router,
    private httpCart: HttpCar
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
    localStorage.removeItem('carItems');
  }

  /**
   * Guarda el usuario en localStorage
   */
  private saveUser(user: DataAuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.authUserData = user;
    this.currentUser.next(user);
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
    localStorage.removeItem('carItems');
    this.authUserData = null;
  }

  // =========================
  // REGISTER
  // =========================

  registerNewUser(newUser: DataAuthUser): Observable<ResponseUser> {

    return this.http.post<ResponseUser>(`${this.baseUrl}/auth/register`, newUser)
      .pipe(

        // transformamos la respuesta
        map((response: ResponseUser) => {
          return response;
        }),

        // manejo de errores
        catchError((error) => {
           return throwError(() => error)
          })

      );
  }

  // CONDIRMAR CORREO

  confirmEmail(data: ConfirmModel): Observable<ConfirmModel>{
    return this.http.post<ConfirmModel>(`${this.baseUrl}/auth/confirm`, data)
    .pipe(
          map((response: ConfirmModel) => {
            return response;
          }),
          catchError((error) => {
           return throwError(() => error)
          })
        );
  }

  // =========================
  // LOGIN
  // =========================

  loginUser(credentials: DataAuthUser): Observable<string> {

    return this.http.post<ResponseApi<DataAuthUser>>(`${this.baseUrl}/auth/login`, credentials)

      .pipe(

        // tap sirve para ejecutar lógica sin modificar el observable
        tap((data: ResponseApi<DataAuthUser>) => {

          // guardamos usuario si existe
          if (data.user) {
            this.saveUser(data.user);
            this.currentUser.next(data.user);
          }

          // guardamos token
          if (data.token) {
            this.saveToken(data.token);
          }

        }),

        map((response) => {
          return response.msg!;
        }),

        catchError((error) => {
           return throwError(() => error)
          })
      );
  }

  // =========================
  // LOGOUT
  // =========================

  logout(): Observable<boolean> {

    this.removeUser();
    this.removeToken();
    this.httpCart.resetCartItems();
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

    return this.http.get<ResponseApi<DataAuthUser>>(`${this.baseUrl}/auth/renew-token`, { headers })

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
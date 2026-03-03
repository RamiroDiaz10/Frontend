import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap,  } from 'rxjs';
import { DataAuthUser } from '../../models/user-model';
import { ResponseApi } from '../../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private authUserData: null | DataAuthUser = null;

  get userData (): null | DataAuthUser {
    
    const storageData = localStorage.getItem('user');
    console.log(storageData)
    if(storageData){
      this.authUserData = JSON.parse(storageData);
    }

    return this.authUserData;

  }
  
  constructor(private http: HttpClient) {}

  registerNewUser(newUser: DataAuthUser ): Observable <string>{
    return this.http.post<ResponseApi>('http://localhost:3000/api/v1/auth/register', newUser)
    .pipe(
      map((response: ResponseApi)=>{
        return response.msg!;
      }),

      catchError((err)=>{
        if(err.error?.msg){
          return of(err.error.msg);
        }

        return of('Error: servidor fallando');
      })

    );
  }

  loginUser (credentials: DataAuthUser): Observable <string >{
    return this.http.post<ResponseApi>('http://localhost:3000/api/v1/auth/login', credentials)
    .pipe(

      tap((data : ResponseApi)=>{
        console.log(data);
        if(data.user){
          localStorage.setItem( 'user', JSON.stringify( data.user));
          this.authUserData = data.user;
        }

        localStorage.setItem('X-Token', data.token!);

        
      }),

      map( (response) => {
        return response.msg!;
      }),

      catchError((err)=>{
        if(err.error?.msg){
          return of(err.error.msg);
        }
          return of('Error: servidor fallando');
      })

    );
  }

  logout(): Observable<boolean>{
    if(this.authUserData){
      this.authUserData = null;
      localStorage.removeItem('user');
      localStorage.removeItem('X-Token');
      return of( true);
    }
    return of( false);


  }

  verifyUser(): Observable<boolean>{
    const token = localStorage.getItem('X-Token') ?? '';
    if(!token){
      return of(false);
    }

    const headers = new HttpHeaders().set( 'X-Token', token );

    return this.http.get<ResponseApi>('http://localhost:3000/api/v1/auth/renew-token', {headers})
    .pipe(
      map(response => {
        console.log(response);
        localStorage.setItem('X-Token', response.token!);
        localStorage.setItem('user', JSON.stringify(response.user!));
        return true;
      }),
      catchError(error => {
        console.log(error);
        localStorage.removeItem( 'X-Token' );
        localStorage.removeItem( 'user' );
        return of(false);
      })
    )

  }

  hasRole(expectRoles: string[]): boolean {
    const userRoles = this.authUserData?.role ? this.authUserData.role : '';

    return expectRoles.includes(userRoles);
  }
}

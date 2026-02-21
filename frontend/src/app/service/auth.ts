import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of,  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private http: HttpClient) {}

  registerNewUser(newUser: any ){
    return this.http.post<any>('http://localhost:3000/api/v1/auth/register', newUser)
    .pipe(
      map((response: any)=>{
        return response.msg;
      }),

      catchError((err)=>{
        if(err.error?.msg){
          return of(err.error.msg);
        }

        return of('Error: servidor fallando');
      })

    );
  }

  loginUser (credentials: any){
    return this.http.post<any>('http://localhost:3000/api/v1/auth/login', credentials)
    .pipe(
      map( (response: any) => {
        return response.msg;
      }),

      catchError((err)=>{
        if(err.error?.msg){
          return of(err.error.msg);
        }
          return of('Error: servidor fallando');
      })

    );
  }
}

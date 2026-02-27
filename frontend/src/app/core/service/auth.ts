import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap,  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private authUserData = null;

  get userData (): any {
    
    const storageData = localStorage.getItem('user');
    console.log(storageData)
    if(storageData){
      this.authUserData = JSON.parse(storageData);
    }

    return this.authUserData;

  }

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

      tap((data : any)=>{
        console.log(data);
        if(data.user){
          localStorage.setItem( 'user', JSON.stringify( data.user));
          this.authUserData = data.user;
        }

        localStorage.setItem('X-Token', data.token);

        
      }),

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

  logout(){
    if(this.authUserData){
      this.authUserData = null;
      localStorage.removeItem('user');
      localStorage.removeItem('X-Token');
      return of( true);
    }
    return of( false);


  }
}

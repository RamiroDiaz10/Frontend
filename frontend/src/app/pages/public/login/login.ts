import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/service/auth';
import { Subscription } from 'rxjs';
import {  Router, RouterLink } from '@angular/router';
import { DataAuthUser } from '../../../models/user-model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  message: string = '';
  formData!: FormGroup;
  private subscription!: Subscription;
  
  constructor(
    private httpAuth: Auth,
    private router: Router

  ){
    this.formData = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])

  });

  }

  ngOnInit(): void {
    console.info('loginComponent inicializado');
    
  }

  ngOnDestroy(): void {
    console.info('loginComponent destruido');
    if(this.subscription){
      this.subscription.unsubscribe();
    }    
  }

  onSubmit(): void {
    if(this.formData.valid) {
      console.log(this.formData.value);

      const inputData: DataAuthUser = {
        email: this.formData.value.email ?? '',
        password: this.formData.value.password ?? ''
      } 

      this.httpAuth.loginUser(inputData).subscribe({
        next: data => {
          console.log('Login successful', data);
          this.message = data;
          
          setTimeout(()=> {
            this.message = '';
            this.router.navigateByUrl('/dashboard');
          }, 2000)  // Navigate to dashboard after login

        },
        error: error => {
          console.error('There was an error during the login!', error);
        },
        complete: () => {
          this.formData.reset();

        }
      });

    } else {
      console.log("Form is invalid");
      this.formData.markAllAsTouched();
    }
  }

  onReset() {
    this.formData.reset();
    this.formData.markAsPristine();
  }

}

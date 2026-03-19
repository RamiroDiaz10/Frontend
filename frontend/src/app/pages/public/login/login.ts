import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Auth } from '../../../core/service/auth';
import { DataAuthUser } from '../../../models/user-model';
import { AlertsService } from '../../../core/service/alerts-service';

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
    private router: Router,
    private alerts: AlertsService

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
      this.alerts.loading('Loading... 🧸');

      this.httpAuth.loginUser(inputData).subscribe({
        next: data => {
          this.alerts.success('!Hey',`${data}`)
          setTimeout(()=> {
            this.router.navigateByUrl('/dashboard');
          }, 2000)  // Navigate to dashboard after login

        },
        error: error => {
            if (error.status === 403) {
              this.alerts.warning('Cuenta Pendiente', 'Por favor, confirma tu correo primero.')
                setTimeout(()=> {
                  this.router.navigateByUrl('/confirm');
                }, 2000)
            } else {
              this.alerts.error('Error', 'Credenciales incorrectas');
            }
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

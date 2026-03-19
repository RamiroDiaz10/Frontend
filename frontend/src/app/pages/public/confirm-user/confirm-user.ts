import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Auth } from '../../../core/service/auth';
import { ConfirmModel } from '../../../models/confirm-model';
import { AlertsService } from '../../../core/service/alerts-service';

@Component({
  selector: 'app-confirm-user',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './confirm-user.html',
  styleUrl: './confirm-user.css',
})
export class ConfirmUser {
  
  formData!: FormGroup;
  private subscription!: Subscription;
  
  constructor(
    private httpAuth: Auth,
    private router: Router,
    private alert: AlertsService

  ){
    this.formData = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('',[Validators.required, Validators.minLength(6)])

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

      const inputData: ConfirmModel = {
        email: this.formData.value.email ?? '',
        code: this.formData.value.code ?? ''
      } 
      this.alert.loading('Validating your code... 🧸'); //solo es un loading

      this.httpAuth.confirmEmail(inputData).subscribe({
        next: data => {
          this.alert.success('¡Excellent!', `Your account has been activated`)
          setTimeout(()=> {
            this.router.navigateByUrl('/login');
          }, 2000)  // Navegar al login despues de confirmar

        },
        error: error => {
          this.alert.error('Código Inválido', error.error || 'Revisa tu correo' );
        },
        complete: () => {
          this.formData.reset();

        }
      });

    } else {
      
      this.formData.markAllAsTouched();
    }
  }

  onReset() {
    this.formData.reset();
    this.formData.markAsPristine();
  }

}


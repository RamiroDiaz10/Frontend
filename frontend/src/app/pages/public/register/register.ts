import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from'@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { DataAuthUser } from '../../../models/user-model';
import { Auth } from '../../../core/service/auth';
import { AlertsService } from '../../../core/service/alerts-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink ],
  templateUrl: './register.html',
  styleUrl: './register.css', 
})
export class Register {
  message: string = '';
  formData!: FormGroup
  
  private subscription!: Subscription;
  

  constructor(
    private auth: Auth,
    private router: Router,
    private alert: AlertsService
    
  ){
      this.formData = new FormGroup({
      name: new FormControl('' ,[Validators.required, Validators.minLength(3)]),      //Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) permite ene espacio tildes letras 
      username: new FormControl('' ,[Validators.required, Validators.minLength(3)]),   //Validators.pattern(/^[a-zA-Z0-9_]+$/)permite alfanumericos inplmentar luego
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('',[Validators.pattern(/^\+?(57)?3\d{9}$/)]),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),   // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/) debe tener almenos 1 mayus etc.
      confirmPassword: new FormControl ('', [Validators.required]),
      role: new FormControl('registered')
    });
    }

  ngOnInit(): void{
      console.info(' Registercomponent inicializado');
  }

  ngOnDestroy(): void{
      console.info(' Registercomponent destruido');
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

  handleSubmit(): void {
    if(this.formData.valid){
      console.log( this.formData.value);

      const inputData: DataAuthUser ={
        name: this.formData.value.name ?? '',
        username: this.formData.value.username ?? '',
        email: this.formData.value.email ?? '',
        phone: this.formData.value.phone ?? '',
        password: this.formData.value.password ?? '',
        role: this.formData.value.role ?? '',
      };

      this.alert.loading('Loading... 🧸');
      this.subscription = this.auth.registerNewUser(inputData).subscribe({
        next:(data) => {
          this.alert.success('¡Ya casi!', 'Revisa tu correo para activar cuenta.')
  
          setTimeout(()=> {
            this.router.navigateByUrl('/confirm');
          }, 2000)
        },
        error: (error) => {
          this.alert.error('Correo Inválido', error.error || 'Revisa tu correo');
        },
        complete: () =>{
          this.formData.reset();
        }
      });
    }else{
      console.log("Form is invalid");
      this.formData.markAllAsTouched();
    }

  }
  onReset() {
    this.formData.reset();
    this.formData.markAsPristine();
  }

}

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from'@angular/forms';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { DataAuthUser } from '../../../models/user-model';
import { Auth } from '../../../core/service/auth';

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
    private router: Router
  ){
      this.formData = new FormGroup({
      name: new FormControl('' ,[Validators.required, Validators.minLength(3)]),      //Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) permite ene espacio tildes letras 
      username: new FormControl('' ,[Validators.required, Validators.minLength(3)]),   //Validators.pattern(/^[a-zA-Z0-9_]+$/)permite alfanumericos inplmentar luego
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8)]),   // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/) debe tener almenos 1 mayus etc.
      role: new FormControl('registered',[Validators.required]),
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
        password: this.formData.value.password ?? '',
        role: this.formData.value.role ?? '',
      };


      this.subscription = this.auth.registerNewUser(inputData).subscribe({
        next:(data) => {
          console.log(data);
          this.message = data;
  
          setTimeout(()=> {
            this.message = '';
            this.router.navigateByUrl('/login');
          }, 2000)
        },
        error: (error) => {
          console.error("Registration failed", error);
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

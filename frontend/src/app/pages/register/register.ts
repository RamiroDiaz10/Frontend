import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from'@angular/forms';
import { Auth } from '../../core/service/auth';
import { Subscription } from 'rxjs';
import { DataAuthUser } from '../../models/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css', 
})
export class Register {
  message: string = '';

  formdata = new FormGroup({
    name: new FormControl('' ,[Validators.required, Validators.minLength(3)]),      //Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) permite ene espacio tildes letras 
    username: new FormControl('' ,[Validators.required, Validators.minLength(3)]),   //Validators.pattern(/^[a-zA-Z0-9_]+$/)permite alfanumericos inplmentar luego
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),   // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/) debe tener almenos 1 mayus etc.
    role: new FormControl('registered',[Validators.required]),


  });
  private subscription!: Subscription;

  constructor(
    private auth: Auth,
    private router: Router


  ){}

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
    if(this.formdata.valid){
      console.log( this.formdata.value);

      const inputData: DataAuthUser ={
        name: this.formdata.value.name ?? '',
        username: this.formdata.value.username ?? '',
        email: this.formdata.value.email ?? '',
        password: this.formdata.value.password ?? '',
        role: this.formdata.value.role ?? '',
      };


      this.subscription = this.auth.registerNewUser(inputData).subscribe((data: any) => {
        console.log(data);

        this.message = data;

        setTimeout(()=> {
          this.message = '';
          this.router.navigateByUrl('login');
        }, 3000)
        this.formdata.reset();
      });
    }

  }


}

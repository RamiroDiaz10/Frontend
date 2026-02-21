import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from'@angular/forms';
import { Auth } from '../../service/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css', 
})
export class Register {
  message: any = '';

  formdata = new FormGroup({
    name: new FormControl('' ,[Validators.required, Validators.minLength(3)]),      //Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) permite ene espacio tildes letras 
    username: new FormControl('' ,[Validators.required, Validators.minLength(3)]),   //Validators.pattern(/^[a-zA-Z0-9_]+$/)permite alfanumericos inplmentar luego
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),   // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/) debe tener almenos 1 mayus etc.
    role: new FormControl('registered',[Validators.required]),


  });
  private subscription!: Subscription;

  constructor(private auth: Auth){}

  ngOnInit(){
      console.info(' Registercomponent inicializado');
  }

  ngOnDestroy(){
      console.info(' Registercomponent destruido');
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

  handleSubmit(){
    if(this.formdata.valid){
      console.log( this.formdata.value);

      this.subscription = this.auth.registerNewUser(this.formdata.value).subscribe((data: any) => {
        console.log(data);

        this.message = data;

        setTimeout(()=> {
          this.message = '';
        }, 3000)
        this.formdata.reset();
      });
    }

  }


}

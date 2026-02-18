import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from'@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css', 
})
export class Register {
  formdata = new FormGroup({
    name: new FormControl('' ,[Validators.required, Validators.minLength(3)]),
    email: new FormControl('',[Validators.required, Validators.email] ),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])

  });

  handleSubmit(){
    if(this.formdata.valid){
      console.log( this.formdata.value);

    }

    this.formdata.reset();
  }


}

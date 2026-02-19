import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formdata = new FormGroup ({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])

  })

  onSubmit(){
    if(this.formdata.valid){
      console.log(this.formdata.value);
    }

    this.formdata.reset();
  }
}

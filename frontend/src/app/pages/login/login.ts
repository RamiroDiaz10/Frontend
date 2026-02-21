import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../service/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  message: any = '';

  formdata = new FormGroup ({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])

  });

  private subscription!: Subscription;

  constructor(private auth: Auth){}

  ngOnInit(): void {
    console.info('loginComponent inicializado');
    
  }

  ngOnDestroy(): void {
    console.info('loginComponent destruido');
    if(this.subscription){
      this.subscription.unsubscribe();
    }    
  }

  onSubmit(){
    if(this.formdata.valid){
      console.log(this.formdata.value);
      this.auth.loginUser(this.formdata.value).subscribe( (data)=>{ 
        console.log(data);

        this.message = data;

        setTimeout(() => {
          this.message = ''
        }, 3000);

        this.formdata.reset();
      });
    }

  }
}

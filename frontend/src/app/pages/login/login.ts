import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/service/auth';
import { Subscription } from 'rxjs';
import {  Router } from '@angular/router';
import { DataAuthUser } from '../../models/user-model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  message: string = '';

  formdata = new FormGroup ({

    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])

  });

  private subscription!: Subscription;

  constructor(
    private auth: Auth,
    private router: Router

  ){}

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
    if(this.formdata.valid){
      console.info(this.formdata.value);

      const inputData: DataAuthUser = {
        email: this.formdata.value.email ?? '',
        password: this.formdata.value.password ?? ''
      } 

      this.auth.loginUser(inputData).subscribe( (data)=>{ 
        console.log(data);

        this.message = data;
        
        setTimeout(() => {
          this.message = '';
          this.router.navigateByUrl('dashboard')

        }, 3000);

        this.formdata.reset();
      });
    }

  }
}

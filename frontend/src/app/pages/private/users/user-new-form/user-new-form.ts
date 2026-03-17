import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { HttpUsers } from '../../../../core/service/http-users';
import { DataUser } from '../../../../models/data-user.model';

@Component({
  selector: 'app-user-new-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {

  formData!: FormGroup;
  private subscription!: Subscription;

  constructor(
    private httpUsers: HttpUsers,
    private router: Router 
  ){
    
    this.formData = new FormGroup ({
      name: new FormControl ('',[Validators.required, Validators.minLength(3)]),
      username: new FormControl ('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      phone: new FormControl('',[Validators.pattern(/^\+?(57)?3\d{9}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),                            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/) debe tener almenos 1 mayus etc
      password: new FormControl('',[Validators.required, Validators.minLength(8)]), 
      confirmPassword: new FormControl ('', [Validators.required]),
      role: new FormControl ('', [Validators.required]),
      isActive: new FormControl(false)

    });

  }

  onSubmit(): void {
    if (this.formData.valid) {
      
      const inputData: DataUser = {
        name: '',
        username: this.formData.value.username ?? '',
        phone: this.formData.value.phone ?? '',
        email: this.formData.value.email ?? '',
        password: this.formData.value.password ?? '',
        role: this.formData.value.role ?? '',
        isActive: this.formData.value.isActive ?? ''
      }

      this.httpUsers.createUser(inputData).subscribe({
        next: (data) => {
          console.info(data);

          Swal.fire({
              title: "User created successfully",
              icon: "success",
              draggable: true
            });

            setTimeout(() => {
            this.router.navigateByUrl('/dashboard/users');
          }, 2000);
        
        },
        error: error => {

          const errorMsg = error.error || 'The user may already exist or there is a server error.';
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              footer: errorMsg
            });
        },
        complete: () => {
          console.info('process finished');
          this.formData.reset();
        }
        
      })
    

    } else{
      console.warn('Form is invalid');
      this.formData.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    console.log('componente destruido')
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  onReset(): void {
    this.formData.setValue({
      name: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        role: '',
        isActive: '',
    });
  }
}

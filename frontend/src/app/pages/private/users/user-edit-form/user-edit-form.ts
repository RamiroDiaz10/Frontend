import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { HttpUsers } from '../../../../core/service/http-users';
import { Subscription } from 'rxjs';
import { DataUser } from '../../../../models/data-user.model';
import Swal from 'sweetalert2';
import { ResponseUser } from '../../../../models/user-model';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export class UserEditForm {
 
  formData!: FormGroup;
  selectId!: string;
  private subscription!: Subscription;

  constructor(
    private httpUsers: HttpUsers,
    private router: Router ,
    private route: ActivatedRoute
  ){
    
    this.formData = new FormGroup ({
      name: new FormControl ('',[Validators.required, Validators.minLength(3)]),
      username: new FormControl ('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      phone: new FormControl('',[Validators.pattern(/^\+?(57)?3\d{9}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),                            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/) debe tener almenos 1 mayus etc
      role: new FormControl ('', [Validators.required]),
      isActive: new FormControl(false)

    });

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(params['_id']){

        this.selectId = params['_id'];

        this.httpUsers.getUserById(params['_id']).subscribe({
          next: (response: any) => {
            console.log(response);

            const { name, username, phone,  email, password, confirmPassword, role, isActive } = response.userFound;

            this.formData.setValue({
              name: name || '',
              username: username || '',
              phone: phone || '',
              email: email || '',                           
              role: role || '',
              isActive: isActive || false
            });

          },error: (error) => {
            console.error('Error fetching editUser:', error);
          },  
          complete: () => {           
            console.info('Petición completada');
          }
        });
      }
    });
    
  }

  onSubmit(): void{
      if(this.formData.valid){
        console.log(this.formData.value);
      }
  
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
          this.httpUsers.updateUser(this.selectId, this.formData.value).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error updating user:', error);
        },
        complete: () => {
          console.info('Petición de actualización completada');
          this.formData.reset({
            name: '',
            username:  '',
            phone:  '',
            email:  '',                           
            password: '',
            confirmPassword:  '',
            role: '',
            isActive: false
          });
          this.router.navigateByUrl('/dashboard/users');
        }
      });
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
  
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

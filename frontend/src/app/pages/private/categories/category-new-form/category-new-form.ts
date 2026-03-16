import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpCategories } from '../../../../core/service/http-categories';
import { DataCategory } from '../../../../models/category-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export class CategoryNewForm {
  message: string = '';
  formData!: FormGroup;
  private subscription!: Subscription;

  constructor(
    private httpCategories: HttpCategories,
    private router: Router
  ){
    this.formData = new FormGroup ({
      name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      description: new FormControl('',[Validators.required, Validators.maxLength(100)]),
      image: new FormControl('',[Validators.required, Validators.maxLength(250)]),
      stock: new FormControl('1',[Validators.required, Validators.min(1)]),
      isActive: new FormControl(true)

    });
  }

  ngOnInit(): void {
    console.info('Componente inicializado')
  }

  
  onSubmit(): void {
    if(this.formData.valid){
      console.log(this.formData.value);

      const inputData: DataCategory = {
        name: this.formData.value.name ?? '',
        description: this.formData.value.description ?? '',
        image: this.formData.value.image ?? '',
        stock: this.formData.value.stock ?? 1,
        isActive: this.formData.value.isActive ?? true
      }


      this.httpCategories.createCategory(inputData).subscribe({
        next: data => {
          console.log(data);
           Swal.fire({
              title: "Category created successfully",
              icon: "success",
              draggable: true
            });
          setTimeout(() => {
            this.router.navigateByUrl('dashboard/categories');
          }, 2000);
        },
        error: error => {
          console.error('Error creating category', error);

          const errorMsg = error.error || 'The product may already exist or there is a server error.';
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
      });
    }else {
      console.warn('Form is invalid');
      this.formData.markAllAsTouched();
    }
  }


  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
  onReset(): void {
    this.formData.setValue({
      name: '',
      description: '',
      image: '',
      stock: 1,
      isActive: true
    });
  }
}

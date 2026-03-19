import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpCategories } from '../../../../core/service/http-categories';
import { DataCategory } from '../../../../models/category-model';
import Swal from 'sweetalert2';
import { AlertsService } from '../../../../core/service/alerts-service';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export class CategoryNewForm {
  formData!: FormGroup;
  private subscription!: Subscription;

  constructor(
    private httpCategories: HttpCategories,
    private router: Router,
    private alert: AlertsService
  ){
    this.formData = new FormGroup ({
      name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      description: new FormControl('',[Validators.required, Validators.maxLength(100)]),
      image: new FormControl('',[Validators.required, Validators.maxLength(250)]),
      stock: new FormControl('1',[Validators.required, Validators.min(1)]),
      isActive: new FormControl(true)

    });
  }


  
  onSubmit(): void {
    if(this.formData.valid){

      const inputData: DataCategory = {
        name: this.formData.value.name ?? '',
        description: this.formData.value.description ?? '',
        image: this.formData.value.image ?? '',
        stock: this.formData.value.stock ?? 1,
        isActive: this.formData.value.isActive ?? true
      }


      this.httpCategories.createCategory(inputData).subscribe({
        next: data => {
          this.alert.success('!Hey','Category created successfully');

          setTimeout(() => {
            this.router.navigateByUrl('dashboard/categories');
          }, 2000);
        },
        error: error => {

          this.alert.error('"Oops..."',error.error || 'The category may already exist or there is a server error.');
        },
        complete: () => {
          this.formData.reset();
        }
      });
    }else {
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

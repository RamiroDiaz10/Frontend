import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpProducts } from '../../../../core/service/http-products';
import { HttpCategories } from '../../../../core/service/http-categories';

@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
})
export class ProductNewForm {
  // categories!: Observable<any[]>; 
  message: string = '';
  formData!: FormGroup;
  private subscription!: Subscription;


  constructor(
    private httpProducts: HttpProducts,
    private HttpCategories: HttpCategories,
    private router: Router 
  ) {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      image: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      size: new FormControl(1, [Validators.required, Validators.min(1)]),
      material: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      color: new FormControl('#000000', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      category: new FormControl('', [Validators.required]),
      isActive: new FormControl(false)
    });
  } 
  ngOnInit(): void {
    console.info('Initializing ProductNewForm component');
    
  }

  onSubmit(): void {
    if (this.formData.valid) {
      this.httpProducts.createProduct(this.formData.value).subscribe({
        next: (data) => {
          console.info(data);
          this.message = data;
          setTimeout(() => {
            this.message = '';
            this.router.navigateByUrl('dashboard/products');
          }, 2000);
        },
        error: (error) => {
          this.message = 'Error creating product', error;
        },
        complete: () => {
          console.info('Process finished'); 
          this.formData.reset();
      
        }
      });
    }else {
      console.warn('Form is invalid');
      this.formData.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      console.info('Unsubscribing from subscription');
      this.subscription.unsubscribe();
    }
    
  }

  onReset() {
    // Establecer los valores iniciales del formulario
    this.formData.setValue({
      name: '',
      description: '',
      image: '',
      size: 1,
      material: '',
      color: '#000000',
      price: 0,
      stock: 0,
      category: '',
      isActive: false,
    });
  }
}

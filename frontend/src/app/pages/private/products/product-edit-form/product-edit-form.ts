import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { HttpProducts } from '../../../../core/service/http-products';
import { HttpCategories } from '../../../../core/service/http-categories';

@Component({
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-edit-form.html',
  styleUrl: './product-edit-form.css',
})
export class ProductEditForm {
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
    console.info('Initializing ProductEditForm component');
  }

    onSubmit(): void {
      if (this.formData.valid) {
        console.info('Form is valid, submitting data:', this.formData.value);
      }
    }
      //   this.httpProducts.updateProduct(this.formData.value).subscribe({
      //     next: (response) => {
      //       console.info('Product updated successfully', response);
      //       this.router.navigate(['/products']);
      //     },
      //     error: (error) => {
      //       console.error('Error updating product', error);
      //       this.message = 'Error updating product';
      //     }
      //   });
      // }
  // }

  ngOnDestroy(): void {
    
    if (this.subscription) {
      console.info('component destroyed, unsubscribing from observable');
      this.subscription.unsubscribe();
    }
  }

  onReset(): void {
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
      isActive: false
    });
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';

import { HttpProducts } from '../../../../core/service/http-products';
import { HttpCategories } from '../../../../core/service/http-categories';
import { DataProduct } from '../../../../models/products.models';

@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,    // Estrategia de detección de cambios: verifica cuando los valores de las propiedades del clase del componente, vinculadas a datos cambian.
})
export class ProductNewForm {

  public categories$: Observable<any[]> = new Observable<any[]>();
  private refreshTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
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
      image: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      size: new FormControl('', [Validators.required, Validators.min(1)]),
      material: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      color: new FormControl('#000000', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      category: new FormControl('', [Validators.required]),
      isActive: new FormControl(false)
    });
  } 
  ngOnInit(): void {
    this.categories$ = this.refreshTrigger$.asObservable().pipe(
      switchMap(() => this.HttpCategories.getCategories())
    );
    
  }

  onSubmit(): void {
    if (this.formData.valid) {

      const inputData: DataProduct = {
              name: this.formData.value.name ?? '',
              description: this.formData.value.description ?? '',
              image: this.formData.value.image ?? '',
              size: this.formData.value.size ?? '',
              material: this.formData.value.material ?? '',
              color: this.formData.value.color ?? '#000000',
              price: this.formData.value.price ?? 0,
              stock: this.formData.value.stock ?? 1,
              category: this.formData.value.category ?? '',
              isActive: this.formData.value.isActive ?? true
            }


      this.httpProducts.createProduct(inputData).subscribe({
        next: (data) => {
          console.info(data);

            Swal.fire({
              title: "Product created successfully",
              icon: "success",
              draggable: true
            });

             setTimeout(() => {
            this.router.navigateByUrl('dashboard/products');
          }, 2000);
         
        },
        error: (error) => {
          // Caso de Error: Aquí es donde mostramos la alerta de falla
          console.error('Error capturado en el componente:', error);
        
        // Extraemos el mensaje del backend o usamos uno por defecto
          const errorMsg = error.error?.msg || 'The product may already exist or there is a server error.';
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              footer: errorMsg
            });
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

  onReset(): void {
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

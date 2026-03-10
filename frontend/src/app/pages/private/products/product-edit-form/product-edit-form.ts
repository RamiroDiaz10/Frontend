import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { HttpProducts } from '../../../../core/service/http-products';
import { HttpCategories } from '../../../../core/service/http-categories';

@Component({
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './product-edit-form.html',
  styleUrl: './product-edit-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,    // Estrategia de detección de cambios: verifica cuando los valores de las propiedades del clase del componente, vinculadas a datos cambian.
})
export class ProductEditForm {

  public categories$: Observable<any[]> = new Observable<any[]>();
  private refreshTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  message: string = ''; 
  formData!: FormGroup;
  private subscription!: Subscription;
  private selectId!: string;
  
  constructor(
    private httpProducts: HttpProducts,
    private HttpCategories: HttpCategories,
    private router: Router,
    private route: ActivatedRoute
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
    this.categories$ = this.refreshTrigger$.asObservable().pipe(
      switchMap(() => this.HttpCategories.getCategories())
    );

    this.route.params.subscribe((params: Params) => {
      if(params['_id']){

        this.selectId = params['_id'];
        
        this.httpProducts.getProductById(params['_id']).subscribe({
          next:(response: any)=> {
            console.log(response)

            const { name, description, image, size, material, color, price, stock, category, isActive } = response.data;
          
            this.formData.setValue({
              name: name || '',
              description: description || '', 
              image: image || '',
              size: size || 1,
              material: material || '',
              color: color || '#000000',
              price: price || 0,
              stock: stock || 0,
              category: category?._id || category || '',
              isActive: isActive || false
            });
          
          },
          error:(error) => {
            console.error('Error fetching product:', error);
          },
          complete:() => {
            console.info('Product fetch completed');
            
          }

        });
      }
    });
  }

    onSubmit(): void {
      if (this.formData.valid) {
        console.info(this.formData.value);
      }

      this.httpProducts.updateProduct(this.selectId, this.formData.value).subscribe({
        next: (response) => {
          console.log(response);

        },
        error: (error) => {
          console.error('Error updating product:', error);
        },  
        complete: () => {
          console.info('Product update request completed');
          this.formData.reset({
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
          this.router.navigateByUrl('/dashboard/products');
        }
      });
    }  

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

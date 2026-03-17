import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { HttpCategories } from '../../../../core/service/http-categories';

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export class CategoryEditForm {
  formData!: FormGroup;
  selectId!: string;
  private subscription!: Subscription;

  constructor(
    private httpCategories: HttpCategories,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.formData = new FormGroup ({
      name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      description: new FormControl('',[Validators.required, Validators.maxLength(100)]),
      image: new FormControl('',[Validators.required, Validators.maxLength(250)]),
      stock: new FormControl('1',[Validators.required, Validators.min(1)]),
      isActive: new FormControl(false)

    });
  }

  ngOnInit(): void {
    console.info('Componente inicializado')
    this.route.params.subscribe((params: Params) => {
      if(params['_id']){

        this.selectId = params['_id'];

        this.httpCategories.getCategoryById(params['_id']).subscribe({
          next: (response: any) => {
            console.log(response);

            const { name, description, image, stock, isActive } = response.data;

            this.formData.setValue({
              name: name || '',
              description: description || '',
              image: image || '',
              stock: stock || 1,
              isActive: isActive || false
            });

          },error: (error) => {
            console.error('Error fetching category:', error);
          },  
          complete: () => {           
            console.info('Petición completada');
          }
        });
      }
    });
  }

  
  onSubmit(): void {
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
        this.httpCategories.updateCategory(this.selectId, this.formData.value).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.error('Error updating category:', error);
      },
      complete: () => {
        console.info('Petición de actualización completada');
        this.formData.reset({
          name: '',
          description: '',
          image: '',
          stock: 1,
          isActive: false
        });
        this.router.navigateByUrl('/dashboard/categories');
      }
    });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });

  }


  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

  onReset(): void {
    this.formData.reset({
      name: '',
      description: '',
      image: '',
      stock: 1,
      isActive: false
    });
  }
}

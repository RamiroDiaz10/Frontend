import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpCategories } from '../../../../core/service/http-categories';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export class CategoryNewForm {
  formData!: FormGroup;
  private subscription!: Subscription;

  constructor(private httpCategories: HttpCategories){
    this.formData = new FormGroup ({
      name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      description: new FormControl('',[Validators.required, Validators.maxLength(100)]),
      image: new FormControl('',[Validators.required, Validators.maxLength(20)]),
      stock: new FormControl('1',[Validators.required, Validators.min(1)]),
      isActive: new FormControl(true)

    });
  }

  ngOnInit(): void {
    console.info('Componente inicializado')
  }

  
  onSubmit(){
    
  }


  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
}

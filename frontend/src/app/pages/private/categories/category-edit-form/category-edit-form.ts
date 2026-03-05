import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { HttpCategories } from '../../../../core/service/http-categories';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export class CategoryEditForm {
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

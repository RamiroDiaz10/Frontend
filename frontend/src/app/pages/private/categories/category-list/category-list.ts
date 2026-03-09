import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, switchMap, Subscription } from 'rxjs';

import { HttpCategories } from '../../../../core/service/http-categories';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [AsyncPipe],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  // Atributo para almacenar la lista de productos
  public categories: Observable<any[]> = new Observable<any[]>();
  // Atributo para controlar la actualización de la lista de productos
  private refreshCategoriesTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  
  private subscription!: Subscription;

  constructor(
    private httpCategories: HttpCategories,
    private router: Router
  ) {}  

  ngOnInit() {
    this.categories = this.refreshCategoriesTrigger$.asObservable().pipe(
      switchMap(() => this.httpCategories.getCategories())
    );
  }

  deleteCategory(_id: string) {
    this.subscription = this.httpCategories.deleteCategory(_id).subscribe({
      next: (response) => {
        console.log(response);
        this.refreshCategoriesTrigger$.next();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
      }
    });
  }

  onEdit(_id: string) {
    this.router.navigateByUrl(`/dashboard/category/edit`);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

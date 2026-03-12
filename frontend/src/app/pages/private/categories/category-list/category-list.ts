import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { HttpCategories } from '../../../../core/service/http-categories';

@Component({
  selector: 'app-category-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  // Atributo para almacenar la lista de categorias
  public categories: Observable<any[]> = new Observable<any[]>();
  // Atributo para controlar la actualización de la lista de categorias
  private refreshCategoriesTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  
  private subscription!: Subscription;

  constructor(
    private httpCategories: HttpCategories,
    private router: Router
  ) {}  

  ngOnInit(): void {
    this.categories = this.refreshCategoriesTrigger$.asObservable().pipe(
      switchMap(() => this.httpCategories.getCategories())
    );
  }

  deleteCategory(_id: string): void {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {

        this.subscription = this.httpCategories.deleteCategory(_id).subscribe({
        next: (response) => {
          console.log(response);
          this.refreshCategoriesTrigger$.next();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
    });

    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
      }
    });

    
  }

  onEdit(_id: string): void {
    this.router.navigateByUrl(`/dashboard/category/edit/${_id}`);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

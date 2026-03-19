import { Component } from '@angular/core';
import { DataCategory } from '../../../models/category-model';
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';
import { HttpCategories } from '../../../core/service/http-categories';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-public-categories',
  imports: [AsyncPipe],
  templateUrl: './public-categories.html',
  styleUrl: './public-categories.css',
})
export class PublicCategories {
  public categories: Observable<DataCategory[]> = new Observable<DataCategory[]>();
    
      private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
      private subscription!: Subscription;
    
      constructor(
        private httpCategories: HttpCategories,
      ) {}
    
    
      ngOnInit(): void {
        this.categories = this.refreshProductsTrigger$.asObservable().pipe(
          switchMap(() => this.httpCategories.getCategories()),
          map(response => response.categories)
        );
      }
    
    
      ngOnDestroy(): void {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        
      }
}

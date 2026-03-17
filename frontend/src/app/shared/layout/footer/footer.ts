import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { HttpCategories } from '../../../core/service/http-categories';
import { DataCategory } from '../../../models/category-model';

@Component({
  selector: 'app-footer',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  public categories: Observable<DataCategory[]> = new Observable<DataCategory[]>();
    private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
    private subscription!: Subscription;
  
    constructor(
      private httpCategories : HttpCategories,
    ) {}
  
  
    ngOnInit(): void {
  
      this.categories = this.refreshProductsTrigger$.asObservable().pipe(
        switchMap(() => this.httpCategories.getCategories()),
        map(response => response.categories)
      );
    }
  
  
    ngOnDestroy(): void {
      console.log('Home component destroyed');
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      
    }
}

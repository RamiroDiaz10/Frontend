import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, map, Observable, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

import { HttpUsers } from '../../../../core/service/http-users';
import { DataUser } from '../../../../models/data-user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList {
    public users$: Observable<DataUser[]> = new Observable<DataUser[]>();
  private refreshUsersTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);  
  private subscription!: Subscription;
  
  constructor(
    private httpUsers: HttpUsers,
    private router: Router 
  ) {}

  ngOnInit(): void {
    console.log('aca inicia user')
    this.users$ = this.refreshUsersTrigger$.asObservable().pipe(
      switchMap(() => this.httpUsers.getUsers()),
      map((response) => {
        console.log(response)
        return response.users})
      
    );
  }

  deleteUser(_id: string): void {
  
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
  
          this.subscription = this.httpUsers.deleteUser(_id).subscribe({
          next: (response) => {
            console.log(response);
            this.refreshUsersTrigger$.next();
          },
          error: (error) => {
            console.error('Error deleting category:', error);
          }
      });
  
      Swal.fire({
        title: "Deleted!",
        text: "Your user has been deleted.",
        icon: "success"
      });
        }
      });
  
      
    }

  onEdit(_id: string): void {
    this.router.navigateByUrl(`/dashboard/user/edit/${_id}`);
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
  

}

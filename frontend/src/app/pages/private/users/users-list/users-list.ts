import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, firstValueFrom, map, Observable, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

import { HttpUsers } from '../../../../core/service/http-users';
import { DataUser } from '../../../../models/data-user.model';
import { Auth } from '../../../../core/service/auth';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [AsyncPipe, RouterModule, RouterLink],
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
        console.log(response,'.....')
        return response.users})
      
    );
  }

  deleteUser(_id: string): void {
  
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:" #E8A598",
        cancelButtonColor: "#8B3A36",
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
        icon: "success",
        confirmButtonColor:" #E8A598"
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

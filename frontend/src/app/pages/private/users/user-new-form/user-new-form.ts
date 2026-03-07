import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpUsers } from '../../../../core/service/http-users';

@Component({
  selector: 'app-user-new-form',
  imports: [],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
  message: string = '';
  formData!: FormData;
  private subscription!: Subscription;

  constructor(
    private httpUsers: HttpUsers,
    private router: Router
  ) { 

  }
}

import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpUsers } from '../../../../core/service/http-users';

@Component({
  selector: 'app-user-new-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm implements OnDestroy {
  private fb = inject(FormBuilder);
  private httpUsers = inject(HttpUsers);
  private router = inject(Router);

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['USER_ROLE'] // Valor por defecto
  });

  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';
  private subscription: Subscription = new Subscription();

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const sub = this.httpUsers.createUser(this.userForm.value).subscribe({
      next: (msg) => {
        this.successMsg = msg;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard/users-list']), 1500); 
      },
      error: (err) => {
        this.errorMsg = err;
        this.loading = false;
      }
    });
    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

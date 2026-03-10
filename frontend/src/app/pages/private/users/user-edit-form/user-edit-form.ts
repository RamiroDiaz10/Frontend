import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpUsers } from '../../../../core/service/http-users';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export class UserEditForm implements OnInit {
  private fb = inject(FormBuilder);
  private httpUsers = inject(HttpUsers);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['USER_ROLE'] // Valor por defecto
  });

  userId: string | null = null;
  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';

  ngOnInit(): void {
    // Obtenemos el ID de la URL (ruta debe ser /users/edit/:id)
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: string): void {
    this.loading = true;
    this.httpUsers.getUserById(id).subscribe({
      next: (user) => {
        if (user) {
          // Llenamos el formulario con los datos recuperados
          this.userForm.patchValue({
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
          });
        }
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar los datos del usuario';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.userId) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    // Enviar la actualización parcial
    this.httpUsers.updateUser(this.userId, this.userForm.value).subscribe({
      next: (msg) => {
        this.successMsg = msg;
        this.loading = false;
        // Redirigir a la lista de usuarios tras 1.5 segundos
        setTimeout(() => this.router.navigate(['/dashboard/users-list']), 1500);
      },
      error: (err) => {
        this.errorMsg = err;
        this.loading = false;
      }
    });
  }
}

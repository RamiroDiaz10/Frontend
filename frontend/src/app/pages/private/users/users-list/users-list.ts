import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpUsers } from '../../../../core/service/http-users';
import { DataAuthUser } from '../../../../models/user-model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  private httpUsers = inject(HttpUsers);

  users: DataAuthUser[] = [];
  loading: boolean = true;
  errorMsg: string = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.httpUsers.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Error al cargar la lista de usuarios';
        this.loading = false;
      }
    });
  }

  deleteUser(id: string | undefined): void {
    if (!id) return;

    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.httpUsers.deleteUser(id).subscribe({
        next: (msg) => {
          console.log(msg);
          // Recargamos la lista después de eliminar
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
}

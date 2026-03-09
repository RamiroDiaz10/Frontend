import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { Auth } from '../../../core/service/auth';
import { DataAuthUser } from '../../../models/user-model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  // Estado del menú móvil (hamburguesa)
  isMenuOpen: boolean = false;

  constructor(
    public auth: Auth,
    private router: Router
  ){}

  get userData(): DataAuthUser | null {
    return this.auth.getUser();
  }

  // Abre/cierra el menú móvil
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Cierra el menú (al navegar o al hacer clic en backdrop)
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onLogout(): void{
    this.closeMenu();
    this.auth.logout().subscribe( data => {
      console.log(data, 'Sesion finalizada');
      this.router.navigateByUrl('/login')
    }
    )
  }

}

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
  
  constructor(
    private auth: Auth,
    private router: Router
  ){}

  get userData(): DataAuthUser | null {
    return this.auth.userData;
  }

  onLogout(): void{
    this.auth.logout().subscribe( data => {
      console.log(data, 'Sesion finalizada');
      this.router.navigateByUrl('login')
    }
    )
  }

}

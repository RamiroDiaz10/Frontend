import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Auth } from '../../../core/service/auth';
import { AsyncPipe } from '@angular/common';

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

  get userData(): any {
    return this.auth.userData;
  }

  onLogout(){
    this.auth.logout().subscribe( data => {
      console.log(data, 'Sesion finalizada');
      this.router.navigateByUrl('login')
    }
    )
  }

}

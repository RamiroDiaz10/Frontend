import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

import { Auth } from '../../../core/service/auth';
import { DataAuthUser } from '../../../models/user-model';
import { HttpCar } from '../../../core/service/http-car';
import { CarItem } from '../../../models/car-item.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public carItem: Observable<CarItem[]> = new Observable<CarItem[]>();
  public totalItems$: Observable<number> = new Observable<number>();
  private refreshProductsTrigger$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);

  // Estado del menú móvil (hamburguesa)
  isMenuOpen: boolean = false;

  constructor(
    public auth: Auth,
    private httpCar: HttpCar,
    private router: Router
  ){}

  ngOnInit(): void {
    this.carItem = this.refreshProductsTrigger$.asObservable().pipe(
    switchMap(() => this.httpCar.getCarItems())
    );

    this.totalItems$ = this.carItem.pipe(
      map(items => items.reduce((acu, item) => acu + item.quantity, 0 ))
    );
    
  }

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

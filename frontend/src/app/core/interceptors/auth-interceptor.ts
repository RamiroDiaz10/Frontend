import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '../service/auth';
import { HttpCar } from '../service/http-car';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

/**
 * Interceptor de autenticación
 * Este interceptor se ejecuta en TODAS las peticiones HTTP
 * realizadas con HttpClient.
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(Auth);
  const cart = inject(HttpCar);
  const router = inject(Router)

 const token = authService.getToken();

  // 1. Si hay token, clonamos la petición
  const authReq = token 
    ? req.clone({ setHeaders: { 'X-Token': token } }) 
    : req;

  // 2. Manejamos la respuesta y capturamos errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Si el error es 401 (Token expirado o inválido)
      if (error.status === 401) {
        
        // A. Limpiamos el carrito en la pantalla (emite [])
        cart.resetCartItems();

        // B. Borramos sesión (Token y User del localStorage)
        authService.logout();

        // C. Mostramos la alerta de SweetAlert
        Swal.fire({
          icon: 'warning',
          title: 'Sesión Expirada',
          text: 'Por seguridad, tu sesión ha finalizado.',
          confirmButtonColor: '#E8A598',
          confirmButtonText: 'Entendido',
          allowOutsideClick: false
        }).then(() => {
          // D. Redirigimos al login después de cerrar la alerta
          router.navigateByUrl('/login');
        });
      }

      return throwError(() => error);
    })
  );
};
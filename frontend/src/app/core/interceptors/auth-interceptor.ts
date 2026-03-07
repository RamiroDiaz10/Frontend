import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { Auth } from '../service/auth';

/**
 * Interceptor de autenticación
 * Este interceptor se ejecuta en TODAS las peticiones HTTP
 * realizadas con HttpClient.
 */

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(Auth);

  const token = authService.getToken();

  // si no hay token dejamos pasar la request
  if (!token) {
    return next(req);
  }

  // clonamos la request agregando headers
  const clonedReq = req.clone({
    setHeaders: {
      'X-Token': token
    }
  });

  // enviamos la request modificada
  return next(clonedReq);
};

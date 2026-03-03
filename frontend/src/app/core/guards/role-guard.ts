import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../service/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  
  const authUser = inject(Auth);
  const router = inject(Router);

  const roles = route.data['expectRoles'] || [];

  const isAutorized = authUser.hasRole(roles);

  if(!isAutorized){
    router.navigateByUrl('dashboard');

  }
  
  return isAutorized;
};

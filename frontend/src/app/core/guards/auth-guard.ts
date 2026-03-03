import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { Auth } from '../service/auth';

export const authGuard: CanActivateFn = (route, state) => {

    const authUser = inject(Auth);
    const router = inject(Router)

    return authUser.verifyUser().pipe(
      map(isAuthenticated => {
        if(!isAuthenticated){
          router.navigateByUrl('/login')
        }
        return isAuthenticated;
      })
    );

  
};

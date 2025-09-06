import { inject } from '@angular/core';
import { CanActivateFn, Router,CanActivateChildFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    return router.createUrlTree(['/login']);   // 👈 redirige
    //router.navigate(['/login']);
    return false;
  }
  return true;
};

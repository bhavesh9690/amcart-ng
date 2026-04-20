import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { selectIsLoggedIn, selectSessionChecked } from '../../store/auth/auth.selectors';

/**
 * Wait until initAuth has finished (sessionChecked = true) before reading
 * isLoggedIn, so a page-refresh doesn't redirect authenticated users to login.
 */
function waitForSessionThen(
  store: Store,
  predicate: (isLoggedIn: boolean) => boolean,
  redirect: string,
  router: Router
) {
  return store.select(selectSessionChecked).pipe(
    filter(checked => checked),
    take(1),
    switchMap(() => store.select(selectIsLoggedIn).pipe(take(1))),
    map(isLoggedIn => {
      if (!predicate(isLoggedIn)) {
        router.navigate([redirect]);
        return false;
      }
      return true;
    })
  );
}

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return waitForSessionThen(store, isLoggedIn => isLoggedIn, '/auth/login', router);
};

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  return waitForSessionThen(store, isLoggedIn => !isLoggedIn, '/', router);
};

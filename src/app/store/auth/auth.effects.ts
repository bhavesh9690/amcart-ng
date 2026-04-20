import { Injectable, inject, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Hub } from 'aws-amplify/utils';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/auth/auth.service';

function cognitoErrorMessage(err: any): string {
  // Amplify v6 uses err.name instead of err.code
  const code = err?.name ?? err?.code;
  switch (code) {
    case 'NotAuthorizedException': return 'Incorrect username or password.';
    case 'UserNotFoundException': return 'No account found with this email.';
    case 'UserNotConfirmedException': return 'Please verify your email before signing in.';
    case 'UsernameExistsException': return 'An account with this email already exists.';
    case 'CodeMismatchException': return 'Invalid verification code.';
    case 'ExpiredCodeException': return 'Verification code has expired. Please request a new one.';
    case 'LimitExceededException': return 'Too many attempts. Please try again later.';
    default: return err?.message ?? 'An unexpected error occurred.';
  }
}

@Injectable()
export class AuthEffects implements OnDestroy {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  /**
   * Amplify Hub listener for the OAuth redirect callback.
   * After Google redirects back to the app, Amplify fires 'signInWithRedirect'.
   * We then fetch the session (tokens are already stored in localStorage by Amplify)
   * and hydrate the NgRx store with loginSuccess.
   */
  private hubUnsubscribe = Hub.listen('auth', ({ payload }) => {
    if (payload.event === 'signInWithRedirect') {
      this.authService.getSession().subscribe({
        next: response => this.store.dispatch(AuthActions.loginSuccess({ response })),
        error: err => this.store.dispatch(AuthActions.loginFailure({ error: err?.message ?? 'Google sign-in failed.' })),
      });
    }
    if (payload.event === 'signInWithRedirect_failure') {
      this.store.dispatch(AuthActions.socialLoginFailure({ error: 'Google sign-in was cancelled or failed.' }));
    }
  });

  ngOnDestroy(): void {
    this.hubUnsubscribe();
  }

  /** Dispatch triggers Google OAuth redirect — no return value, browser navigates away. */
  socialLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.socialLogin),
      tap(() => this.authService.signInWithGoogle())
    ),
    { dispatch: false }
  );

  /**
   * On app startup, attempt to restore the session from Amplify's localStorage cache.
   * Amplify stores Cognito tokens in localStorage after sign-in and refreshes them
   * transparently using the stored refresh token.
   */
  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      switchMap(() =>
        this.authService.getSession().pipe(
          map(response => AuthActions.restoreSessionSuccess({ response })),
          catchError(() => of(AuthActions.restoreSessionFailure()))
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(err => of(AuthActions.loginFailure({ error: cognitoErrorMessage(err) })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/']))
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authService.register(data).pipe(
          map(() => AuthActions.registerSuccess({ email: data.email })),
          catchError(err => of(AuthActions.registerFailure({ error: cognitoErrorMessage(err) })))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(({ email }) => this.router.navigate(['/auth/confirm-signup'], { queryParams: { email } }))
    ),
    { dispatch: false }
  );

  confirmSignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmSignUp),
      switchMap(({ req }) =>
        this.authService.confirmSignUp(req).pipe(
          map(() => AuthActions.confirmSignUpSuccess()),
          catchError(err => of(AuthActions.confirmSignUpFailure({ error: cognitoErrorMessage(err) })))
        )
      )
    )
  );

  confirmSignUpSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.confirmSignUpSuccess),
      tap(() => this.router.navigate(['/auth/login']))
    ),
    { dispatch: false }
  );
}

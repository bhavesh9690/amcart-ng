import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  email: string | null;
  roles: string[];
  isLoading: boolean;
  error: string | null;
  pendingConfirmationEmail: string | null;
  /** True once initAuth has finished (success or failure). Guards wait for this before checking isLoggedIn. */
  sessionChecked: boolean;
}

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  email: null,
  roles: [],
  isLoading: false,
  error: null,
  pendingConfirmationEmail: null,
  sessionChecked: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, state => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    userId: response.userId,
    email: response.email,
    roles: response.roles,
    error: null,
    pendingConfirmationEmail: null,
    sessionChecked: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AuthActions.logout, () => ({ ...initialState, sessionChecked: true })),
  // Session restore on app startup from Amplify's localStorage cache
  on(AuthActions.restoreSessionSuccess, (state, { response }) => ({
    ...state,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    userId: response.userId,
    email: response.email,
    roles: response.roles,
    error: null,
    sessionChecked: true,
  })),
  on(AuthActions.restoreSessionFailure, state => ({ ...state, sessionChecked: true })),
  on(AuthActions.register, state => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.registerSuccess, (state, { email }) => ({
    ...state,
    isLoading: false,
    pendingConfirmationEmail: email,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(AuthActions.confirmSignUp, state => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.confirmSignUpSuccess, state => ({
    ...state,
    isLoading: false,
    pendingConfirmationEmail: null,
    error: null,
  })),
  on(AuthActions.confirmSignUpFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);

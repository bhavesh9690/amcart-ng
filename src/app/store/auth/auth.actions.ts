import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, RegisterRequest, ConfirmSignUpRequest } from '../../core/models/auth.model';

export const login = createAction('[Auth] Login', props<{ credentials: LoginRequest }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: LoginResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');

/** Triggers the Google OAuth redirect via Cognito Hosted UI. */
export const socialLogin = createAction('[Auth] Social Login');
export const socialLoginFailure = createAction('[Auth] Social Login Failure', props<{ error: string }>());

export const register = createAction('[Auth] Register', props<{ data: RegisterRequest }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ email: string }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

export const confirmSignUp = createAction('[Auth] Confirm Sign Up', props<{ req: ConfirmSignUpRequest }>());
export const confirmSignUpSuccess = createAction('[Auth] Confirm Sign Up Success');
export const confirmSignUpFailure = createAction('[Auth] Confirm Sign Up Failure', props<{ error: string }>());

/** Dispatched on app startup to restore a cached Amplify session from localStorage. */
export const initAuth = createAction('[Auth] Init');
export const restoreSessionSuccess = createAction('[Auth] Restore Session Success', props<{ response: LoginResponse }>());
export const restoreSessionFailure = createAction('[Auth] Restore Session Failure');

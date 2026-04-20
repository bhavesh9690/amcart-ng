import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(selectAuthState, state => !!state.accessToken);
export const selectAccessToken = createSelector(selectAuthState, state => state.accessToken);
export const selectCurrentUserEmail = createSelector(selectAuthState, state => state.email);
export const selectAuthLoading = createSelector(selectAuthState, state => state.isLoading);
export const selectAuthError = createSelector(selectAuthState, state => state.error);
export const selectUserRoles = createSelector(selectAuthState, state => state.roles);
export const selectPendingConfirmationEmail = createSelector(selectAuthState, state => state.pendingConfirmationEmail);
export const selectSessionChecked = createSelector(selectAuthState, state => state.sessionChecked);

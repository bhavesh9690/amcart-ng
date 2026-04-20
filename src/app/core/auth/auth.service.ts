import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CognitoService } from './cognito.service';
import { LoginRequest, LoginResponse, RegisterRequest, ConfirmSignUpRequest, UserProfile } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private cognito: CognitoService) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.cognito.signIn(credentials);
  }

  register(data: RegisterRequest): Observable<void> {
    return this.cognito.signUp(data);
  }

  confirmSignUp(req: ConfirmSignUpRequest): Observable<void> {
    return this.cognito.confirmSignUp(req);
  }

  /** Restore session from Amplify's cached tokens in localStorage. */
  getSession(): Observable<LoginResponse> {
    return this.cognito.getSession();
  }

  refreshToken(): Observable<LoginResponse> {
    return this.cognito.refreshSession();
  }

  logout(): void {
    this.cognito.signOut();
  }

  signInWithGoogle(): void {
    this.cognito.signInWithGoogle();
  }

  getUserProfile(): Observable<UserProfile> {
    return this.cognito.getUserProfile();
  }
}


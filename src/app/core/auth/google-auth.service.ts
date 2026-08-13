import { Injectable } from '@angular/core';
import { Observable, from, of, throwError, Subscriber } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/auth.model';

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleIdTokenPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  exp?: number;
  iat?: number;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private scriptLoadPromise?: Promise<void>;
  private pendingObserver?: Subscriber<LoginResponse>;

  signInWithGoogle(): Observable<LoginResponse> {
    return from(this.loadScript()).pipe(
      switchMap(() =>
        new Observable<LoginResponse>(observer => {
          if (this.pendingObserver) {
            observer.error(new Error('Google login is already in progress.'));
            return;
          }

          const google = this.getGoogle();
          if (!google?.accounts?.id?.initialize || !google?.accounts?.id?.prompt) {
            observer.error(new Error('Google Identity Services is not available.'));
            return;
          }

          this.pendingObserver = observer;
          google.accounts.id.initialize({
            client_id: environment.google.clientId,
            callback: (response: GoogleCredentialResponse) => this.handleCredentialResponse(response),
          });

          google.accounts.id.prompt();

          return () => {
            this.pendingObserver = undefined;
          };
        })
      )
    );
  }

  getSession(): Observable<LoginResponse> {
    const stored = localStorage.getItem('amcart_google_session');
    if (!stored) {
      return throwError(() => new Error('No Google login session found.'));
    }

    try {
      return of(JSON.parse(stored) as LoginResponse);
    } catch {
      return throwError(() => new Error('Failed to restore Google login session.'));
    }
  }

  signOut(): void {
    localStorage.removeItem('amcart_google_session');
    const google = this.getGoogle();
    if (google?.accounts?.id?.disableAutoSelect) {
      google.accounts.id.disableAutoSelect();
    }
  }

  private handleCredentialResponse(response: GoogleCredentialResponse): void {
    const observer = this.pendingObserver;
    this.pendingObserver = undefined;
    if (!observer) {
      return;
    }

    if (!response?.credential) {
      observer.error(new Error('Google did not return a valid credential.'));
      return;
    }

    try {
      const payload = this.decodeJwtPayload<GoogleIdTokenPayload>(response.credential);
      const loginResponse: LoginResponse = {
        accessToken: response.credential,
        refreshToken: '',
        userId: payload.sub,
        email: payload.email ?? '',
        roles: ['CUSTOMER'],
      };

      localStorage.setItem('amcart_google_session', JSON.stringify(loginResponse));
      observer.next(loginResponse);
      observer.complete();
    } catch (err) {
      observer.error(err instanceof Error ? err : new Error('Failed to parse Google credential.'));
    }
  }

  private decodeJwtPayload<T>(jwt: string): T {
    const parts = jwt.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format.');
    }

    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(payload)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(decoded) as T;
  }

  private loadScript(): Promise<void> {
    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement | null;
    if (existing) {
      this.scriptLoadPromise = new Promise((resolve, reject) => {
        const scriptElement = existing as any;
        if (scriptElement.readyState === 'complete' || scriptElement.readyState === 'loaded') {
          resolve();
        } else {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services script.')));
        }
      });
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script.'));
      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  private getGoogle(): any {
    return (window as any).google;
  }
}

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  fetchAuthSession,
  fetchUserAttributes,
  signInWithRedirect,
} from 'aws-amplify/auth';
import { LoginRequest, LoginResponse, RegisterRequest, ConfirmSignUpRequest, UserProfile } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CognitoService {
  /** Normalize any phone number to E.164 format required by Cognito. */
  private toE164(phone: string): string {
    const stripped = phone.replace(/[^\d+]/g, '');
    if (stripped.startsWith('+')) return stripped;
    const digits = stripped.replace(/^0/, '');
    return `+91${digits}`;
  }

  /** Sign up a new user. Cognito sends a verification email/SMS. */
  signUp(data: RegisterRequest): Observable<void> {
    return from(
      signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.firstName,
            family_name: data.lastName,
            phone_number: this.toE164(data.mobile),
            gender: data.gender,
          },
        },
      })
    ).pipe(map(() => void 0));
  }

  /** Confirm sign-up with the verification code sent by Cognito. */
  confirmSignUp(req: ConfirmSignUpRequest): Observable<void> {
    return from(
      confirmSignUp({ username: req.email, confirmationCode: req.code })
    ).pipe(map(() => void 0));
  }

  /**
   * Authenticate with Cognito via Amplify.
   * Amplify automatically stores the session tokens in localStorage after sign-in,
   * keyed under `CognitoIdentityServiceProvider.<clientId>.<username>.*`.
   */
  signIn(credentials: LoginRequest): Observable<LoginResponse> {
    return from(
      signIn({ username: credentials.email, password: credentials.password }).then(
        ({ isSignedIn, nextStep }) => {
          if (!isSignedIn) {
            const step = nextStep?.signInStep ?? 'UNKNOWN';
            throw Object.assign(new Error(`Sign-in requires additional step: ${step}`), {
              name: 'SignInIncompleteException',
              step,
            });
          }
          return fetchAuthSession();
        }
      ).then(session => this.sessionToLoginResponse(session))
    );
  }

  /** Sign out the current user and clear Amplify's stored session. */
  signOut(): void {
    signOut().catch(err => console.error('[AmCart] Sign-out error:', err));
  }

  /**
   * Restore session from Amplify's localStorage cache.
   * Amplify auto-refreshes the access token using the stored refresh token if needed.
   */
  getSession(): Observable<LoginResponse> {
    return from(fetchAuthSession()).pipe(
      map(session => this.sessionToLoginResponse(session))
    );
  }

  /** Refresh the session by forcing a token refresh from Cognito. */
  refreshSession(): Observable<LoginResponse> {
    return from(fetchAuthSession({ forceRefresh: true })).pipe(
      map(session => this.sessionToLoginResponse(session))
    );
  }

  private sessionToLoginResponse(session: Awaited<ReturnType<typeof fetchAuthSession>>): LoginResponse {
    const { tokens } = session;
    if (!tokens) {
      throw new Error('No active Cognito session.');
    }
    const idPayload = tokens.idToken?.payload ?? {};
    const groups = idPayload['cognito:groups'];
    return {
      accessToken: tokens.accessToken.toString(),
      refreshToken: '',  // Amplify manages the refresh token internally
      userId: String(idPayload['sub'] ?? ''),
      email: String(idPayload['email'] ?? ''),
      roles: (Array.isArray(groups) ? groups : ['CUSTOMER']) as string[],
    };
  }

  /**
   * Fetch the current user's profile attributes from Cognito.
   * Uses fetchUserAttributes (Amplify v6) which calls the GetUser API.
   */
  getUserProfile(): Observable<UserProfile> {
    return from(fetchUserAttributes()).pipe(
      map(attrs => ({
        firstName: String(attrs['given_name'] ?? ''),
        lastName:  String(attrs['family_name'] ?? ''),
        email:     String(attrs['email'] ?? ''),
        phone:     String(attrs['phone_number'] ?? ''),
        gender:    String(attrs['gender'] ?? ''),
      }))
    );
  }

  /**
   * Redirect the browser to the Cognito Hosted UI for Google OAuth.
   * After successful authentication Cognito redirects back to the app,
   * Amplify exchanges the code and stores tokens in localStorage.
   * The Hub 'signInWithRedirect' event is fired and the AuthEffects
   * Hub listener restores the session into the NgRx store.
   */
  signInWithGoogle(): void {
    signInWithRedirect({ provider: 'Google' });
  }
}

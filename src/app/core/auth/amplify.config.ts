import { ResourcesConfig } from 'aws-amplify';
import { environment } from '../../../environments/environment';

/**
 * AWS Amplify configuration.
 * Amplify uses this to configure the Cognito User Pool and manages session tokens
 * automatically in localStorage under the key prefix `CognitoIdentityServiceProvider`.
 */
export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolClientId,
      loginWith: {
        email: true,
        oauth: {
          // Cognito Hosted UI domain (without https://)
          domain: environment.cognito.cognitoDomain,
          scopes: ['email', 'openid', 'profile'],
          // Must match the Callback URL configured in Cognito App client settings
          redirectSignIn: ['http://localhost:4200'],
          redirectSignOut: ['http://localhost:4200'],
          responseType: 'code',
        },
      },
    },
  },
};

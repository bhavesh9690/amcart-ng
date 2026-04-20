export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8082',
  useMockApi: false,
  cognito: {
    userPoolId: 'eu-north-1_fVR3iZleW',
    userPoolClientId: '4ef8rcfvtm6dg0kmr3a9n1mrgm',
    region: 'eu-north-1',
    // Cognito Hosted UI domain (set under App integration → Domain in Cognito console)
    cognitoDomain: 'amcart-auth.auth.eu-north-1.amazoncognito.com'
  }
};

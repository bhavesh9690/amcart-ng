export const environment = {
  production: false,
  apiBaseUrl: 'http://ac97fb30ab94b436f9f4fecbd4c99b20-346183276.eu-north-1.elb.amazonaws.com',
  useMockApi: false,
  cognito: {
    userPoolId: 'eu-north-1_fVR3iZleW',
    userPoolClientId: '4ef8rcfvtm6dg0kmr3a9n1mrgm',
    region: 'eu-north-1',
    // Cognito Hosted UI domain (set under App integration → Domain in Cognito console)
    cognitoDomain: 'amcart-auth.auth.eu-north-1.amazoncognito.com'
  }
};

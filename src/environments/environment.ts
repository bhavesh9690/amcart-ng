export const environment = {
  production: false,
  apiBaseUrl: 'http://k8s-ecommerc-products-ba7a41f2cf-6b205eadd49af56a.elb.eu-north-1.amazonaws.com',
  useMockApi: false,
  cognito: {
    userPoolId: 'eu-north-1_rKf9Ua4v3',
    userPoolClientId: '3hnej3pmord03va63qdjdlfo6n',
    region: 'eu-north-1',
    // Cognito Hosted UI domain (set under App integration → Domain in Cognito console)
    cognitoDomain: 'amcart-auth.auth.eu-north-1.amazoncognito.com'
  }
};

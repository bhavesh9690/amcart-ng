import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './app/core/auth/amplify.config';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Configure Amplify once at application startup.
// Amplify will persist Cognito session tokens in localStorage automatically.
Amplify.configure(amplifyConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

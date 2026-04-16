import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => {
  // eslint-disable-next-line no-console -- Global error message
  console.error(err);
});

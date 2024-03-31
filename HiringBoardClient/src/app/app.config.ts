import { provideAnimations } from '@angular/platform-browser/animations';
import { TuiRootModule } from '@taiga-ui/core';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { stageFeature } from './store/features/stages.feature';
import { interviewerFeature } from './store/features/interviewer.feature';
import * as appEffects from './store/app.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(TuiRootModule),
    provideStore(),
    provideState(stageFeature),
    provideState(interviewerFeature),
    provideEffects(appEffects)
  ]
};

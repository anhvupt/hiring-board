import { inject } from '@angular/core';
import {
  Actions,
  ROOT_EFFECTS_INIT,
  createEffect,
  ofType
} from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AppService } from '~/data-access/app.service';
import { StageActions } from './features/stages.feature';
import { InterviewerActions } from './features/interviewer.feature';

export const loadStagesEffects = createEffect(
  (actions$ = inject(Actions), appService = inject(AppService)) =>
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        appService.getStages().pipe(
          map((stages) => {
            return StageActions.loaded({ stages });
          }),
          catchError((error) =>
            of(StageActions.error({ error: error.message }))
          )
        )
      )
    ),
  { functional: true }
);
export const loadInterviewersEffects = createEffect(
  (actions$ = inject(Actions), appService = inject(AppService)) =>
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        appService.getInterviewers().pipe(
          map((interviewers) => InterviewerActions.loaded({ interviewers })),
          catchError((error) =>
            of(
              InterviewerActions.error({
                error: error.message
              })
            )
          )
        )
      )
    ),
  { functional: true }
);

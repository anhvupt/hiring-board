import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { pipe, switchMap, withLatestFrom, tap, catchError, of } from 'rxjs';
import { Board } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { stageFeature } from '~/store/features/stages.feature';

const initialState = {
  candidates: {} as Board,
  isMultipleMoving: false
};

@Injectable()
export class BoardStore
  extends ComponentStore<typeof initialState>
  implements OnStateInit
{
  private readonly appService = inject(AppService);
  private readonly store = inject(Store);

  constructor() {
    super(initialState);
  }

  ngrxOnStateInit() {
    this.loadBoard({});
  }

  loadBoard = this.effect<object>(
    pipe(
      switchMap(() => this.appService.getCandidates()),
      withLatestFrom(this.store.select(stageFeature.selectData)),
      tap(([candidates, stages]) => {
        const resolved = stages.reduce(
          (acc, cur) => ({ ...acc, [`${cur.id}`]: candidates[cur.id] ?? [] }),
          {}
        );
        this.patchState({ candidates: resolved });
      }),
      catchError((error) => {
        console.error(error);
        return of(error);
      })
    )
  );
}

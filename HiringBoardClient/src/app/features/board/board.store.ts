import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { catchError, of, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import { Board, CandidateParams } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { stageFeature } from '~/store/features/stages.feature';

const initialState = {
  candidates: {} as Board,
  params: {
    interviewerId: '',
    search: '',
    createdDate: null
  } as CandidateParams,
  selectableStage: null as null | number,
  selectedIds: new Set<number>()
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
    this.loadBoard(this.select(({ params }) => params));
  }

  resetSelection() {
    this.patchState({ selectedIds: new Set() });
  }

  reloadBoard(params?: Partial<CandidateParams>) {
    this.patchState((x) => ({
      params: { ...x.params, ...params } ?? cloneDeep(initialState.params)
    }));
  }

  toggleCandidateSelection(id: number) {
    this.patchState((state) => {
      const selectedIds = cloneDeep(state.selectedIds);
      selectedIds.has(id) ? selectedIds.delete(id) : selectedIds.add(id);
      return { selectedIds };
    });
  }

  toggleSelectable(id: number) {
    this.patchState((x) => ({
      selectableStage: x.selectableStage !== id ? id : null
    }));
  }

  private readonly loadBoard = this.effect<CandidateParams>(
    pipe(
      switchMap((params) => this.appService.getCandidates(params)),
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

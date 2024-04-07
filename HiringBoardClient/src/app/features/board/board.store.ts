import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import {
  catchError,
  delay,
  of,
  pipe,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { Board, CandidateParams } from '~/data-access/app.model';
import { AppService } from '~/data-access/app.service';
import { interviewerFeature } from '~/store/features/interviewer.feature';
import { stageFeature } from '~/store/features/stages.feature';

const initialState = {
  candidates: {} as Board,
  params: {
    interviewerId: '',
    search: '',
    createdDate: null
  } as CandidateParams,
  selectableStage: null as null | number,
  selectedIds: new Set<number>(),
  isDragging: false,
  isCandidateLoading: false
};

@Injectable()
export class BoardStore
  extends ComponentStore<typeof initialState>
  implements OnStoreInit
{
  private readonly appService = inject(AppService);
  private readonly store = inject(Store);

  readonly isLoading$ = this.select(
    this.select((x) => x.isCandidateLoading),
    this.store.select(interviewerFeature.selectLoading),
    this.store.select(stageFeature.selectLoading),
    (...loadings) => {
      return loadings.includes(true);
    }
  ).pipe(delay(200));

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit() {
    this.loadBoard(this.select(({ params }) => params));
  }

  resetDnDStates() {
    this.patchState({ selectedIds: new Set(), isDragging: false });
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
      tap(() => this.patchState({ isCandidateLoading: true })),
      switchMap((params) => this.appService.getCandidates(params)),
      withLatestFrom(this.store.select(stageFeature.selectData)),
      tap(([candidates, stages]) => {
        const resolved = stages.reduce(
          (acc, cur) => ({ ...acc, [`${cur.id}`]: candidates[cur.id] ?? [] }),
          {}
        );
        this.patchState({ candidates: resolved, isCandidateLoading: false });
      }),
      catchError((error) => {
        console.error(error);
        return of(error);
      })
    )
  );
}

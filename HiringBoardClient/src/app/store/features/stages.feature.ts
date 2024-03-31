import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props
} from '@ngrx/store';
import { Stage } from '~/data-access/app.model';
import { BaseState, initialState, onError, onLoading } from './base.state';

export interface StageState extends BaseState<Stage[]> {}

export const StageActions = createActionGroup({
  source: 'Stage',
  events: {
    load: emptyProps(),
    loaded: props<{ stages: Stage[] }>(),
    error: props<{ error: string }>()
  }
});

export const stageFeature = createFeature({
  name: 'stage',
  reducer: createReducer<StageState>(
    initialState,
    on(StageActions.load, (state) => onLoading(state)),
    on(StageActions.loaded, (state, { stages }) => {
      return {
        ...state,
        data: stages,
        loading: false
      };
    }),
    on(StageActions.error, onError)
  )
});

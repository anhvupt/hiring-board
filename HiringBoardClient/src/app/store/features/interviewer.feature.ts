import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props
} from '@ngrx/store';
import { Interviewer } from '~/data-access/app.model';
import { BaseState, initialState, onError, onLoading } from './base.state';

export interface InterviewerState extends BaseState<Interviewer[]> {}

export const InterviewerActions = createActionGroup({
  source: 'Interviewer',
  events: {
    load: emptyProps(),
    loaded: props<{ interviewers: Interviewer[] }>(),
    error: props<{ error: string }>()
  }
});

export const interviewerFeature = createFeature({
  name: 'interviewer',
  reducer: createReducer<InterviewerState>(
    initialState,
    on(InterviewerActions.load, (state) => onLoading(state)),
    on(InterviewerActions.loaded, (state, { interviewers }) => {
      return {
        ...state,
        data: interviewers,
        loading: false
      };
    }),
    on(InterviewerActions.error, onError)
  )
});

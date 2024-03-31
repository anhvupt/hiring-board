// src/app/store/base.state.ts
export interface BaseState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

export const initialState = {
  data: [],
  loading: false,
  error: null
};

export function onLoading<T>(state: BaseState<T>): BaseState<T> {
  return { ...state, loading: true, error: null };
}

export function onError<T>(
  state: BaseState<T>,
  action: { error: string }
): BaseState<T> {
  return { ...state, loading: false, error: action.error };
}

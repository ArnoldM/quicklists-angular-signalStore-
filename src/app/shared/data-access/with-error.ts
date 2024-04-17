import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export interface ErrorState {
  error: string | null;
}

export const withError = () => signalStoreFeature(
  withState<ErrorState>({ error: null }),
  withMethods(state => {
    return {
      setError(value: string | null) {
        patchState(state, { error: value })
      }
    }
  })
)

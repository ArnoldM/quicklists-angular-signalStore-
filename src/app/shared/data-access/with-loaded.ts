import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';

export interface LoadedState {
  loaded: boolean;
}

export const withLoaded = () => signalStoreFeature(
  withState<LoadedState>({ loaded: false }),
  withMethods(state => {
    return {
      setLoaded(value: boolean) {
        patchState(state, { loaded: value })
      }
    }
  })
)

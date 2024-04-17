import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { patchState, signalStoreFeature, withMethods, withState } from '@ngrx/signals';
import { setAllEntities } from '@ngrx/signals/entities';

import { Checklist } from '../interfaces/checklist';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return isPlatformBrowser(inject(PLATFORM_ID))
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

export const withChecklistStorage = () => signalStoreFeature(
  withState({}),
  withMethods(state => {
    const storage = inject(LOCAL_STORAGE);

    return {
      saveCheckListsToLocalStorage(checklists: Checklist[]) {
        storage.setItem('checklists', JSON.stringify(checklists));
      },
      loadChecklistsFromLocalStorage() {
        const checklistsJson = storage.getItem('checklists');
        if (!checklistsJson) {
          return false;
        }
        patchState(state, [setAllEntities(JSON.parse(checklistsJson)), { loaded: true }]);
        return true;
      }
    }
  })
)

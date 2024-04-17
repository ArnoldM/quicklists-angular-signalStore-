import { effect } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, updateEntity, withEntities } from '@ngrx/signals/entities';

import { AddChecklist, Checklist, EditCheckList } from '../interfaces/checklist';
import { withLoaded } from './with-loaded';
import { withError } from './with-error';
import { withChecklistStorage } from './with-checklist-storage';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const ChecklistStore = signalStore(
  { providedIn: 'root' },
  withDevtools('checklists'),
  withLoaded(),
  withError(),
  withChecklistStorage('checklists'),
  withEntities<Checklist>(),
  withMethods(state => {
    const addIdToChecklist = (checklist: AddChecklist): Checklist => ({
      ...checklist,
      id: generateSlug(checklist.title),
    })
    const generateSlug = (title: string): string => {
      let slug = title.toLowerCase().replace(/\s+/g, '-');

      const matchingSlugs = state.entities().find(
        (checklist) => checklist.id === slug,
      );

      if (matchingSlugs) {
        slug = slug + Date.now.toString();
      }

      return slug;
    }

    effect(() => {
      const checklists = state.entities();
      state.saveCheckListsToLocalStorage(checklists);
    })

    return {
      add(checklist: AddChecklist) {
        patchState(state, addEntity(addIdToChecklist(checklist)));
      },
      remove(id: string) {
        patchState(state, removeEntity(id));
      },
      edit(checklist: EditCheckList) {
        patchState(state, updateEntity({ id: checklist.id, changes: checklist.data }));
      }
    }
  }),
  withHooks({
    onInit(state) {
      state.loadChecklistsFromLocalStorage();
    },
  })
)

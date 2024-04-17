import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  updateEntities,
  updateEntity,
  withEntities
} from '@ngrx/signals/entities';

import { AddChecklistItem, ChecklistItem, EditChecklistItem } from '../../shared/interfaces/checklist-item';
import { withChecklistStorage } from '../../shared/data-access/with-checklist-storage';
import { withLoaded } from '../../shared/data-access/with-loaded';
import { withError } from '../../shared/data-access/with-error';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { effect } from '@angular/core';

export const ChecklistItemStore = signalStore(
  { providedIn: 'root'},
  withDevtools('checklistItems'),
  withLoaded(),
  withError(),
  withEntities<ChecklistItem>(),
  withChecklistStorage('checklistItems'),
  withMethods(state => {

    effect(() => {
      const checklistItems = state.entities();
      state.saveCheckListsToLocalStorage(checklistItems);
    });

    return {
      add(checklistItem: AddChecklistItem) {
        patchState(state, addEntity({
          ...checklistItem.item,
          id: Date.now().toString(),
          checklistId: checklistItem.checklistId,
          checked: false
        }))
      },
      toggle(checklistItemId: string) {
        const checklistItem = state.entityMap()[checklistItemId];
        patchState(state, updateEntity({
          id: checklistItemId, changes: {
            checked: !checklistItem.checked
          }
        }));
      },
      reset(checklistId: string) {
        patchState(state, updateEntities({
          predicate: (checklistItem) => checklistItem.id === checklistId,
          changes: { checked: false }
        }))
      },
      edit(update: EditChecklistItem) {
        patchState(state, updateEntity({ id: update.id, changes: { title: update.data.title } }))
      },
      remove(checklistItemId: string) {
        patchState(state, removeEntity(checklistItemId))
      }
    };
  }),
  withHooks({
    onInit(state) {
      state.loadChecklistsFromLocalStorage();
    }
  })
)

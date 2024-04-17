import { signalStore, withMethods } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';

import { AddChecklistItem, ChecklistItem, EditChecklistItem } from '../../shared/interfaces/checklist-item';
import { withChecklistStorage } from '../../shared/data-access/with-checklist-storage';
import { withLoaded } from '../../shared/data-access/with-loaded';
import { withError } from '../../shared/data-access/with-error';

export const checklistItemStore = signalStore(
  withLoaded(),
  withError(),
  withEntities<ChecklistItem>(),
  withChecklistStorage('checklistItems'),
  withMethods(state => {
    return {
      add(checklistItem: AddChecklistItem) {},
      toggle(checklistItemId: string) {},
      reset(checklistId: string) {},
      edit(update: EditChecklistItem) {}
    };
  })
)

import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';

import { AddChecklist, Checklist, EditCheckList } from '../interfaces/checklist';
import { ChecklistService } from './checklist.service';
import { withLoaded } from './with-loaded';
import { withError } from './with-error';
import { withChecklistStorage } from './with-checklist-storage';

export const checklistStore = signalStore(
  { providedIn: 'root' },
  withLoaded(),
  withError(),
  withChecklistStorage(),
  withEntities<Checklist>(),
  withMethods(state => {
    const checklistService = inject(ChecklistService);
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

    return {
      loadCheckList() {},
      add(checklist: AddChecklist) {},
      remove(id: string) {},
      edit(checklist: EditCheckList) {}
    }
  })
)

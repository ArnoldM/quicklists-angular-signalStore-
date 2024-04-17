import { Injectable, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

import {
  AddChecklist,
  EditCheckList,
} from '../interfaces/checklist';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';
import { checklistStore } from './checklist.store';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  #checklistStore = inject(checklistStore);
  #checklistItemService = inject(ChecklistItemService);

  checklists = computed(() => this.#checklistStore.entities());

  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditCheckList>();
  remove$ = this.#checklistItemService.checklistRemoved$;

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.#checklistStore.add(checklist)
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) => this.#checklistStore.remove(id)
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) => this.#checklistStore.edit(update)
    );
  }
}

import { Injectable, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

import {
  AddChecklistItem,
  EditChecklistItem,
  RemoveChecklistItem,
} from '../../shared/interfaces/checklist-item';
import { RemoveChecklist } from '../../shared/interfaces/checklist';
import { ChecklistItemStore } from './checklist-item.store';

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  #checklistItemStore = inject(ChecklistItemStore);

  checklistItems = computed(() => this.#checklistItemStore.entities());

  add$ = new Subject<AddChecklistItem>();
  toggle$ = new Subject<RemoveChecklistItem>();
  reset$ = new Subject<RemoveChecklist>();
  edit$ = new Subject<EditChecklistItem>();
  remove$ = new Subject<RemoveChecklistItem>();
  checklistRemoved$ = new Subject<RemoveChecklist>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) => this.#checklistItemStore.add(checklistItem)
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((checklistItemId) =>
      this.#checklistItemStore.toggle(checklistItemId)
    );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.#checklistItemStore.reset(checklistId),
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) => this.#checklistItemStore.edit(update),
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) => this.#checklistItemStore.remove(id)
    );

    this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe((checklistId) => this.#checklistItemStore.reset(checklistId)
    );
  }
}

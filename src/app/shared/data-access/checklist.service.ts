import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  AddChecklist,
  Checklist,
  EditCheckList,
} from '../interfaces/checklist';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';

export interface ChecklistState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  #storageService = inject(StorageService);
  #checklistItemService = inject(ChecklistItemService);
  // state
  private state = signal<ChecklistState>({
    checklists: [],
    loaded: false,
    error: null,
  });
  // selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);
  // sources
  add$ = new Subject<AddChecklist>();
  edit$ = new Subject<EditCheckList>();
  remove$ = this.#checklistItemService.checklistRemoved$;
  private checklistsLoaded$ = this.#storageService.loadChecklists();

  constructor() {
    // reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdTochecklist(checklist)],
      })),
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) =>
      this.state.update((state) => ({
        ...state,
        checklists: state.checklists.filter((checklist) => checklist.id !== id),
      })),
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) =>
      this.state.update((state) => ({
        ...state,
        checklists: state.checklists.map((checklist) =>
          checklist.id === update.id
            ? { ...checklist, title: update.data.title }
            : checklist,
        ),
      })),
    );

    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
        })),
      error: (err) => this.state.update((state) => ({ ...state, error: err })),
    });

    // effects
    effect(() => {
      if (this.loaded()) {
        this.#storageService.saveChecklists(this.checklists());
      }
    });
  }

  addIdTochecklist(checklist: AddChecklist): Checklist {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  generateSlug(title: string): string {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug,
    );

    if (matchingSlugs) {
      slug = slug + Date.now.toString();
    }

    return slug;
  }
}

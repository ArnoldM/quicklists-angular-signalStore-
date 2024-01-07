import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChecklistItem } from '../shared/interfaces/checklist-item';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';

@Component({
  standalone: true,
  selector: 'app-checklist',
  template: `
    @if (checklist(); as checklist) {
    <app-checklist-header
      [checklist]="checklist"
      (addItem)="checklistItemBeingEdited.set({})"
    />
    }
    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template>
        <app-form-modal
          title="Create item"
          [formGroup]="checklistItemForm"
          (save)="
            checklistItemService.add$.next({
              item: checklistItemForm.getRawValue(),
              checklistId: checklist()?.id!
            })
          "
          (close)="checklistItemBeingEdited.set(null)"
        ></app-form-modal>
      </ng-template>
    </app-modal>
    <app-checklist-item-list [checklistItems]="items()" />
  `,
  imports: [
    ReactiveFormsModule,
    ChecklistHeaderComponent,
    ChecklistItemListComponent,
    FormModalComponent,
    ModalComponent,
  ],
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);
  params = toSignal(this.route.paramMap);

  checklist = computed(() => {
    const checklists = this.checklistService.checklists();
    const id = this.params()?.get('id');
    const checklist = checklists.find((checklist) => checklist.id === id);
    return checklist;
  });

  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id'))
  );

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
      }
    });
  }
}

import { Component, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>

    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>You can't see me... yet</ng-template>
    </app-modal>
  `,
  imports: [ModalComponent],
})
export default class HomeComponent {
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);
}

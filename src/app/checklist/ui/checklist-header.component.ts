import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>{{ checklist.title }}</h1>
      <div>
        <button (click)="addItem.emit()">Add Item</button>
        <button (click)="resetChecklist.emit(checklist.id)">Reset</button>
      </div>
    </header>
  `,
  imports: [RouterLink],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<RemoveChecklist>();
}

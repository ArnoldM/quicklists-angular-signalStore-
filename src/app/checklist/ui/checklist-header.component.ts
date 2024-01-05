import { Component, Input } from '@angular/core';
import { Checklist } from '../../shared/interfaces/checklist';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-checklist-header',
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>{{ checklist.title }}</h1>
    </header>
  `,
  imports: [RouterLink],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
}

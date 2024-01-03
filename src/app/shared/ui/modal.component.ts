import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: ``,
})
export class ModalComponent {
  dialog = inject(Dialog);

  @ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.dialog.open(this.template, { panelClass: 'dialog-container' });
    } else {
      this.dialog.closeAll();
    }
  }
}

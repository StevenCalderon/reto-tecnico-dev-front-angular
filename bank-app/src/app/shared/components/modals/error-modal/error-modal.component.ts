import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {
  @Input() message: string = 'Ocurrió un error inesperado.';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}

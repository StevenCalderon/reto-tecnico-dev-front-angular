import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalComponent } from './shared/components/modals/error-modal/error-modal.component';
import { ErrorModalService } from './shared/services/error-modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showErrorModal = false;
  errorMessage = '';

  constructor(private errorModalService: ErrorModalService) {
    this.errorModalService.errors$.subscribe(message => {
      this.showErrorModal = true;
      this.errorMessage = message;
    });
  }
}

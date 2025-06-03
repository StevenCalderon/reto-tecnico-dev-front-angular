import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'img-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './img-logo.component.html',
  styleUrl: './img-logo.component.scss'
})
export class ImgLogoComponent {
  @Input() src: string = '';
  @Input() name: string = '';
  @Input() size: number = 48;

  imageError = false;

  get initials(): string {
    if (!this.name) return '';
    const words = this.name.trim().split(' ');
    return words.slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  onError() {
    this.imageError = true;
  }
}

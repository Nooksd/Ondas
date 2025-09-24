import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header-button-action',
  standalone: true,
  template: ` <button (click)="handleClick()" class="btn-action">{{ buttonText() }}</button> `,
  styles: [
    `
      .btn-action {
        padding: 0.5rem 1rem;
        background-color: #176dc6;
        color: #fff;
        border-radius: 0.5rem;
        cursor: pointer;
      }
    `,
  ],
})
export class HeaderButtonActionComponent {
  buttonText = input<String>();
  onClick = input<() => void>();

  handleClick() {
    const fn = this.onClick();
    if (typeof fn === 'function') {
      fn();
    }
  }
}

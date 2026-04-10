import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-cfg-button',
  templateUrl: './cfg-button.component.html',
  styleUrl: './cfg-button.component.scss',
})
export class CfgButtonComponent {
  readonly btnClick = output<void>();
  readonly active = signal(false);

  onClick(): void {
    this.btnClick.emit();
  }
}


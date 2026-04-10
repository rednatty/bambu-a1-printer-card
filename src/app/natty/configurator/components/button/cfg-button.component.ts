import { Component, output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cfg-button',
  templateUrl: './cfg-button.component.html',
  styleUrl: './cfg-button.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CfgButtonComponent {
  readonly btnClick = output<void>();

  onClick(): void {
    this.btnClick.emit();
  }
}


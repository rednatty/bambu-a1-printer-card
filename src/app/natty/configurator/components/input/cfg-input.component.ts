import { Component, input, output, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cfg-input',
  templateUrl: './cfg-input.component.html',
  styleUrl: './cfg-input.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [FormsModule],
})
export class CfgInputComponent {
  readonly placeholder = input('');
  readonly initial = input<string>('');
  readonly onUpdate = output<string>();

  readonly value = signal('');

  ngOnInit(): void {
    this.value.set(this.initial());
  }

  onChange(val: string): void {
    this.value.set(val);
    this.onUpdate.emit(val);
  }
}


import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-yes-no-select',
  templateUrl: './yes-no-select.component.html',
  styleUrl: './yes-no-select.component.scss',
})
export class YesNoSelectComponent {
  readonly placeholder = input('Select...');
  readonly initial = input<boolean>(false);
  readonly onSelect = output<boolean>();

  readonly options = [
    { key: 'Yes', value: true },
    { key: 'No', value: false },
  ];

  readonly selection = signal<string>('');
  readonly hidden = signal(true);
  readonly active = signal(false);

  ngOnInit(): void {
    this.selection.set(this.initial() ? 'Yes' : 'No');
  }

  showOptions(): void {
    this.hidden.set(false);
  }

  selectOption(option: { key: string; value: boolean }): void {
    this.selection.set(option.key);
    this.onSelect.emit(option.value);
    this.hidden.set(true);
  }
}


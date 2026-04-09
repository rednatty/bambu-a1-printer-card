import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-few-selector',
  templateUrl: './few-selector.component.html',
  styleUrl: './few-selector.component.scss',
})
export class FewSelectorComponent {
  readonly options = input<Record<string, unknown>>({});
  readonly initial = input<unknown>(undefined);
  readonly onUpdate = output<{ key: string; value: unknown }>();

  readonly activeIndex = signal(-1);

  ngOnInit(): void {
    const vals = Object.values(this.options());
    const idx = vals.indexOf(this.initial());
    this.activeIndex.set(idx);
  }

  get optionKeys(): string[] {
    return Object.keys(this.options());
  }

  selectOption(index: number): void {
    this.activeIndex.set(index);
    const key = this.optionKeys[index];
    this.onUpdate.emit({ key, value: this.options()[key] });
  }
}


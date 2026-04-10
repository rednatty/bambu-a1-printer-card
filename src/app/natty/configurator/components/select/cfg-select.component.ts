import { Component, HostListener, input, output, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cfg-select',
  templateUrl: './cfg-select.component.html',
  styleUrl: './cfg-select.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CfgSelectComponent {
  readonly options = input.required<Record<string, string>>();
  readonly placeholder = input('Select...');
  readonly initial = input<string | undefined>(undefined);
  readonly onSelect = output<{ key: string; value: unknown }>();

  readonly selection = signal<string | undefined>(undefined);
  readonly hidden = signal(true);

  ngOnInit(): void {
    this.selection.set(this.initial());
  }

  get optionKeys(): string[] {
    return Object.keys(this.options());
  }

  showOptions(): void {
    this.hidden.update((v) => !v);
  }

  hideOptions(): void {
    this.hidden.set(true);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.hideOptions();
  }

  selectOption(key: string): void {
    this.selection.set(key);
    const opts = this.options();
    this.onSelect.emit({ key, value: opts[key as keyof typeof opts] });
    this.hideOptions();
  }
}


import { Component, input, output, signal } from '@angular/core';
import { Enum } from '../../../types';

@Component({
  selector: 'app-multi-selector',
  templateUrl: './multi-selector.component.html',
  styleUrl: './multi-selector.component.scss',
})
export class MultiSelectorComponent {
  readonly items = input.required<Enum>();
  readonly initial = input<string[]>([]);
  readonly onChange = output<string[]>();

  readonly selected = signal<string[]>([]);
  readonly available = signal<string[]>([]);

  get stock(): string[] {
    return Object.values(this.items()) as string[];
  }

  ngOnInit(): void {
    const init = this.initial();
    this.selected.set([...init]);
    this.available.set(this.stock.filter((item) => !init.includes(item)));
  }

  isSelected(item: string): boolean {
    return this.selected().includes(item);
  }

  getY(item: string): number {
    const sel = this.selected();
    const avail = this.available();
    if (sel.includes(item)) return 56 * sel.indexOf(item);
    return 56 * (sel.length + avail.indexOf(item));
  }

  toggle(item: string): void {
    const sel = this.selected();
    const avail = this.available();

    if (sel.includes(item)) {
      const i = sel.indexOf(item);
      this.selected.set([...sel.slice(0, i), ...sel.slice(i + 1)]);
      this.available.set([item, ...avail]);
    } else {
      const i = avail.indexOf(item);
      this.available.set([...avail.slice(0, i), ...avail.slice(i + 1)]);
      this.selected.set([...sel, item]);
    }
    this.onChange.emit(this.selected());
  }

  reorder(item: string, mod: number): void {
    const sel = this.selected();
    const ind = sel.indexOf(item);
    const newPos = ind + mod;
    if (newPos < 0 || newPos > sel.length - 1) return;

    const clone = [...sel];
    const tmp = clone[newPos];
    clone[newPos] = item;
    clone[ind] = tmp;
    this.selected.set(clone);
    this.onChange.emit(clone);
  }
}


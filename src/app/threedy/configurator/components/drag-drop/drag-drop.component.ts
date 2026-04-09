import { Component, input, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.scss',
  imports: [DragDropModule],
})
export class DragDropComponent {
  readonly items = input<string[]>([]);

  readonly inUse = signal<string[]>([]);
  readonly available = signal<string[]>(['Status', 'ETA', 'Elapsed', 'Hotend', 'Bed']);

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}


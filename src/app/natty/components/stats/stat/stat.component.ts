import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
})
export class StatComponent {
  readonly name = input.required<string>();
  readonly value = input.required<string>();
}


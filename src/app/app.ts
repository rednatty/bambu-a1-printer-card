import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreedyWrapperComponent } from './threedy/threedy-wrapper.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThreedyWrapperComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}

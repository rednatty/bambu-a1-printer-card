import { Component } from '@angular/core';
import { BambuLabWrapperComponent } from './natty/bambu-lab-wrapper.component';

@Component({
  selector: 'app-root',
  imports: [BambuLabWrapperComponent],
  templateUrl: './app.html',
})
export class App {}

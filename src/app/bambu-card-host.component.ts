import { Component, input, ViewEncapsulation } from '@angular/core';
import { BambuLabWrapperComponent } from './natty/bambu-lab-wrapper.component';
import { BambuLabConfig, HomeAssistant } from './natty/types';

@Component({
  selector: 'bambu-card-host',
  template: `<app-bambu-lab-wrapper [hass]="hass()" [config]="config()" />`,
  imports: [BambuLabWrapperComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BambuCardHostComponent {
  readonly hass = input<HomeAssistant>();
  readonly config = input<BambuLabConfig>();
}


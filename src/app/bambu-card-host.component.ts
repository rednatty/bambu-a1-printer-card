import { Component, input, ViewEncapsulation } from '@angular/core';
import { ThreedyWrapperComponent } from './threedy/threedy-wrapper.component';
import { HomeAssistant, ThreedyConfig } from './threedy/types';

@Component({
  selector: 'bambu-card-host',
  template: `<app-threedy-wrapper [hass]="hass()" [config]="config()" />`,
  imports: [ThreedyWrapperComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BambuCardHostComponent {
  readonly hass = input<HomeAssistant>();
  readonly config = input<ThreedyConfig>();
}


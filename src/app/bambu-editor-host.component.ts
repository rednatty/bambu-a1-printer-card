import { Component, ElementRef, inject, input } from '@angular/core';
import { ConfiguratorComponent } from './threedy/configurator/configurator.component';
import { HomeAssistant, ThreedyConfig } from './threedy/types';

@Component({
  selector: 'bambu-editor-host',
  template: `<app-configurator [hass]="hass()!" [config]="config()" [threedyElement]="hostElement" />`,
  imports: [ConfiguratorComponent],
})
export class BambuEditorHostComponent {
  private readonly elementRef = inject(ElementRef);

  readonly hass = input<HomeAssistant>();
  readonly config = input<ThreedyConfig>();

  get hostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}


import { Component, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';
import { ConfiguratorComponent } from './threedy/configurator/configurator.component';
import { HomeAssistant, ThreedyConfig } from './threedy/types';

@Component({
  selector: 'bambu-editor-host',
  template: `<app-configurator [hass]="hass()!" [config]="config()" [threedyElement]="hostElement" />`,
  imports: [ConfiguratorComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BambuEditorHostComponent {
  private readonly elementRef = inject(ElementRef);

  readonly hass = input<HomeAssistant>();
  readonly config = input<ThreedyConfig>();

  get hostElement(): HTMLElement {
    const element = this.elementRef.nativeElement as HTMLElement;
    const host = element.getRootNode() instanceof ShadowRoot ? (element.getRootNode() as ShadowRoot).host : undefined;
    return (host as HTMLElement | undefined) ?? element;
  }
}


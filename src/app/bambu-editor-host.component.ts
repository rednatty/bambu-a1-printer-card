import { Component, ElementRef, inject, input, ViewEncapsulation } from '@angular/core';
import { ConfiguratorComponent } from './natty/configurator/configurator.component';
import { BambuLabConfig, HomeAssistant } from './natty/types';

@Component({
  selector: 'bambu-editor-host',
  template: `<app-configurator [hass]="hass()!" [config]="config()" [bambuLabElement]="hostElement" />`,
  imports: [ConfiguratorComponent],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class BambuEditorHostComponent {
  private readonly elementRef = inject(ElementRef);

  readonly hass = input<HomeAssistant>();
  readonly config = input<BambuLabConfig>();

  get hostElement(): HTMLElement {
    const element = this.elementRef.nativeElement as HTMLElement;
    const host = element.getRootNode() instanceof ShadowRoot ? (element.getRootNode() as ShadowRoot).host : undefined;
    return (host as HTMLElement | undefined) ?? element;
  }
}


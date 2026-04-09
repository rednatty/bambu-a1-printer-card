import { Component, effect, inject, input } from '@angular/core';
import { ThreedyService } from './services/threedy.service';
import { HomeAssistant, ThreedyConfig } from './types';
import { CardComponent } from './components/card/card.component';
import { NotConfiguredComponent } from './components/not-configured/not-configured.component';

@Component({
  selector: 'app-threedy-wrapper',
  templateUrl: './threedy-wrapper.component.html',
  imports: [CardComponent, NotConfiguredComponent],
})
export class ThreedyWrapperComponent {
  private readonly threedy = inject(ThreedyService);

  readonly hass = input<HomeAssistant>();
  readonly config = input<ThreedyConfig>();

  readonly hasData = this.threedy.hasData;

  constructor() {
    effect(() => {
      const hass = this.hass();
      if (hass) this.threedy.hass.set(hass);
    });

    effect(() => {
      const config = this.config();
      if (config) this.threedy.config.set(config);
    });
  }
}


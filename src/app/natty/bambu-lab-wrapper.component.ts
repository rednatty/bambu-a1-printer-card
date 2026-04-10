import { Component, effect, inject, input } from '@angular/core';
import { BambuLabService } from './services/bambu-lab.service';
import { BambuLabConfig, HomeAssistant } from './types';
import { CardComponent } from './components/card/card.component';
import { NotConfiguredComponent } from './components/not-configured/not-configured.component';

@Component({
  selector: 'app-bambu-lab-wrapper',
  templateUrl: './bambu-lab-wrapper.component.html',
  imports: [CardComponent, NotConfiguredComponent],
})
export class BambuLabWrapperComponent {
  private readonly bambuLab = inject(BambuLabService);

  readonly hass = input<HomeAssistant>();
  readonly config = input<BambuLabConfig>();

  readonly hasData = this.bambuLab.hasData;

  constructor() {
    effect(() => {
      const hass = this.hass();
      if (hass) this.bambuLab.hass.set(hass);
    });

    effect(() => {
      const config = this.config();
      if (config) this.bambuLab.config.set(config);
    });
  }
}



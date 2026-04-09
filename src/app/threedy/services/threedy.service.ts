import { Injectable, signal, computed } from '@angular/core';
import { HomeAssistant, ThreedyConfig } from '../types';

@Injectable({ providedIn: 'root' })
export class ThreedyService {
  readonly hass = signal<HomeAssistant | undefined>(undefined);
  readonly config = signal<ThreedyConfig | undefined>(undefined);

  readonly hasData = computed(() => !!this.hass() && !!this.config());
}


import { Injectable, signal, computed } from '@angular/core';
import { BambuLabConfig, HomeAssistant } from '../types';

@Injectable({ providedIn: 'root' })
export class BambuLabService {
  readonly hass = signal<HomeAssistant | undefined>(undefined);
  readonly config = signal<BambuLabConfig | undefined>(undefined);

  readonly hasData = computed(() => !!this.hass() && !!this.config());
}


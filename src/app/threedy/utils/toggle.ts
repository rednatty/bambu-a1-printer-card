import { fireHaptic } from './haptics';
import { HomeAssistant } from '../types';

export function toggleEntity(hass: HomeAssistant, entityId: string | undefined): void {
  if (hass && entityId && hass.states[entityId]) {
    fireHaptic();
    hass.callService('homeassistant', 'toggle', { entity_id: entityId });
  }
}


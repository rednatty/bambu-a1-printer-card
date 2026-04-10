import { HomeAssistant, HassEntity } from '../types';

export function getEntity(hass: HomeAssistant | undefined, entityId: string): HassEntity | undefined {
  if (!hass || !hass.states || !hass.states[entityId]) return undefined;
  return hass.states[entityId];
}


import { HomeAssistant, ThreedyConfig } from '../types';

export function printerName(entityId: string | undefined): string | undefined {
  if (!entityId) return undefined;
  return entityId
    .replace(/(_current_state|_print_progress)/, '')
    .replace('sensor.', '')
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

function printerBase(entityId: string | undefined): string | undefined {
  if (!entityId) return undefined;
  return entityId.replace(/(_current_state|_print_progress)/, '');
}

export function getPrinters(hass: HomeAssistant): Record<string, string> {
  const printers: Record<string, string> = {};
  Object.keys(hass.states)
    .filter((entityId) => /sensor\..*(_current_state|_print_progress)/g.test(entityId))
    .forEach((entityId) => {
      const name = printerName(entityId);
      if (name) {
        printers[name] = printerBase(entityId)!;
      }
    });
  return printers;
}

export function getToggleables(hass: HomeAssistant): Record<string, string> {
  const toggleables: Record<string, string> = {};
  Object.keys(hass.states)
    .filter((entityId) => /^(switch|light)/g.test(entityId))
    .forEach((toggleable) => (toggleables[toggleable] = toggleable));
  return toggleables;
}

export function getCameras(hass: HomeAssistant): Record<string, string> {
  const cameras: Record<string, string> = {};
  Object.keys(hass.states)
    .filter((entityId) => /^camera\..*/g.test(entityId))
    .forEach((camera) => (cameras[camera] = camera));
  return cameras;
}

export interface ConfigEventDetail {
  config: ThreedyConfig;
}

export function updateConfig(threedy: HTMLElement, modifiedConfig: ThreedyConfig, updates: Partial<ThreedyConfig>): ThreedyConfig {
  const event = new CustomEvent<ConfigEventDetail>('config-changed', {
    bubbles: true,
    composed: true,
    detail: {
      config: { ...modifiedConfig, ...updates },
    },
  });
  threedy.dispatchEvent(event);
  return event.detail.config;
}



import { BambuLabConfig, HomeAssistant } from '../types';

const DEFAULT_CARD_TYPE = 'custom:bambu-printer-card';

export function printerName(entityId: string | undefined): string | undefined {
  if (!entityId) return undefined;
  return entityId
    .replace(/(_print_status|_print_progress)/, '')
    .replace('sensor.', '')
    .split('_')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

function printerBase(entityId: string | undefined): string | undefined {
  if (!entityId) return undefined;
  return entityId.replace(/(_print_status|_print_progress)/, '');
}

export function getPrinters(hass: HomeAssistant): Record<string, string> {
  const printers: Record<string, string> = {};
  Object.keys(hass.states)
    .filter((entityId) => /sensor\..*(_print_status|_print_progress)/g.test(entityId))
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


export interface ConfigEventDetail {
  config: BambuLabConfig;
}

export function updateConfig(bambuLabElement: HTMLElement, modifiedConfig: BambuLabConfig, updates: Partial<BambuLabConfig>): BambuLabConfig {
  const mergedConfig = { ...modifiedConfig, ...updates } as BambuLabConfig;
  if (!mergedConfig.type) {
    mergedConfig.type = DEFAULT_CARD_TYPE;
  }

  const event = new CustomEvent<ConfigEventDetail>('config-changed', {
    bubbles: true,
    composed: true,
    detail: {
      config: mergedConfig,
    },
  });
  bambuLabElement.dispatchEvent(event);
  return event.detail.config;
}



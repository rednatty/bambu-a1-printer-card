export enum BambuLabCondition {
  Status = 'Status',
  ETA = 'ETA',
  Elapsed = 'Elapsed',
  Hotend = 'Hotend',
  Bed = 'Bed',
  Remaining = 'Remaining',
}

export enum BambuLabTemperatureUnit {
  F = 'F',
  C = 'C',
}

export interface BambuLabConfig {
  type: string;
  base_entity?: string;
  name?: string;
  monitored?: (BambuLabCondition | string)[];
  round?: boolean;
  vertical?: boolean;
  round_temperature?: boolean;
  round_time?: boolean;
  temperature_unit?: BambuLabTemperatureUnit;
  use_24hr?: boolean;
  light_entity?: string;
  power_entity?: string;
  always_show?: boolean;
  printer_config?: Record<string, unknown>;
  sensors?: Record<string, Record<string, string>>;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  test?: boolean;
  testUrl?: string;
}

export interface HassEntities {
  [entityId: string]: HassEntity;
}

export interface HomeAssistant {
  states: HassEntities;
  themes?: { darkMode: boolean };
  callService(domain: string, service: string, serviceData?: object, target?: unknown): Promise<unknown>;
  [propName: string]: unknown;
}


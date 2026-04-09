export enum ThreedyPrinter {
  I3 = 'I3',
  Cantilever = 'Cantilever',
  BambuA1 = 'BambuA1',
}

export enum ThreedyTheme {
  Default = 'Default',
  Neumorphic = 'Neumorphic',
}

export enum ThreedyCondition {
  Status = 'Status',
  ETA = 'ETA',
  Elapsed = 'Elapsed',
  Hotend = 'Hotend',
  Bed = 'Bed',
  Remaining = 'Remaining',
}

export enum ThreedyTemperatureUnit {
  F = 'F',
  C = 'C',
}

export type Enum = Record<string, unknown>;

export interface ThreedyConfig {
  type: string;
  base_entity?: string;
  name?: string;
  printer_type?: ThreedyPrinter;
  monitored?: (ThreedyCondition | string)[];
  theme?: ThreedyTheme;
  font?: string;
  scale?: number;
  round?: boolean;
  vertical?: boolean;
  round_temperature?: boolean;
  round_time?: boolean;
  temperature_unit?: ThreedyTemperatureUnit;
  use_24hr?: boolean;
  use_mqtt?: boolean;
  light_entity?: string;
  power_entity?: string;
  camera_entity?: string;
  always_show?: boolean;
  camera_rotate?: boolean;
  camera_mirror?: boolean;
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
  themes: { darkMode: boolean };
  callService(domain: string, service: string, serviceData?: object, target?: unknown): Promise<unknown>;
  [propName: string]: unknown;
}


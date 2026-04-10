import { BambuLabCondition, BambuLabConfig, BambuLabTemperatureUnit, HassEntity, HomeAssistant } from '../../types';
import { getEntity } from '../../utils/home-assistant';

// ─── Temperature helpers ───

function temperatureUnitFromEntity(entity: HassEntity): BambuLabTemperatureUnit {
  switch (entity.attributes['unit_of_measurement']) {
    case '°C': return BambuLabTemperatureUnit.C;
    case '°F': return BambuLabTemperatureUnit.F;
    default:   return BambuLabTemperatureUnit.C;
  }
}

const temperatureMap: Record<string, Record<string, (t: number) => number>> = {
  [BambuLabTemperatureUnit.C]: {
    [BambuLabTemperatureUnit.C]: (t) => t,
    [BambuLabTemperatureUnit.F]: (t) => (t * 9.0) / 5.0 + 32.0,
  },
  [BambuLabTemperatureUnit.F]: {
    [BambuLabTemperatureUnit.C]: (t) => ((t - 32.0) * 5.0) / 9.0,
    [BambuLabTemperatureUnit.F]: (t) => t,
  },
};

function convertTemperature(temperature: number, from: BambuLabTemperatureUnit, to: BambuLabTemperatureUnit): number {
  if (!temperatureMap[from] || !temperatureMap[from][to]) return -1;
  return temperatureMap[from][to](temperature);
}

export function formatTemperature(temperatureEntity: HassEntity, config: BambuLabConfig): string {
  const t = parseFloat(temperatureEntity.state);
  const u = temperatureUnitFromEntity(temperatureEntity);
  const tc = convertTemperature(t, u, config.temperature_unit || u);
  return `${config.round_temperature ? Math.round(tc) : tc.toFixed(2)}°${config.temperature_unit || u}`;
}

// ─── Time helpers ───

function formatDuration(time: number, round: boolean): string {
  if (round) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    if (hours > 0) return `about ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'a few seconds';
  }

  const d = Math.floor(time / 86400);
  const h = Math.floor((time % 86400) / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);

  return `${d > 0 ? `${d}d` : ''}${h > 0 ? ` ${h}h` : ''}${m > 0 ? ` ${m}m` : ''}${s > 0 ? ` ${s}s` : ''}`.trim();
}

function isIsoDate(str: string): boolean {
  return /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/.test(str);
}

function convertIsoDate(str: string): string {
  const pad = (num: number) => {
    num = Math.round(num);
    return (num < 10 ? '0' + Math.abs(num).toString() : Math.abs(num).toString());
  };
  const time = +new Date(str) - Date.now();
  const secs = time / 1000;
  const hrs = Math.trunc(secs / 3600);
  const mins = Math.trunc((secs % 3600) / 60);
  const s = secs % 60;
  return `${pad(hrs)}:${pad(mins)}:${pad(s)}`;
}

export function getTotalSeconds(timeEntity: HassEntity | undefined, attr?: string): number {
  let state = attr?.toString() || timeEntity?.state?.toString();
  if (state == null) return 0;

  state = isIsoDate(state) ? convertIsoDate(state) : state;

  const parts = state.split(':');
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return (+hours) * 3600 + (+minutes) * 60 + (+seconds);
  }

  return parseInt(state, 10) || 0;
}

export function renderTime(time: number, condition: BambuLabCondition, config: BambuLabConfig): string {
  const r = config.round_time ?? false;

  switch (condition) {
    case BambuLabCondition.Remaining:
      return formatDuration(time, r);
    case BambuLabCondition.ETA: {
      const eta = new Date(Date.now() + time * 1000);
      if (config.use_24hr) {
        return eta.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      }
      return eta.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    case BambuLabCondition.Elapsed:
      return formatDuration(time, r);
    default:
      return '<unknown>';
  }
}

// ─── Condition rendering data ───

export interface StatData {
  type: 'stat' | 'temperature' | 'time';
  name: string;
  value?: string;
  // for temperature
  temperatureEntity?: HassEntity;
  // for time
  timeEntity?: HassEntity;
  condition?: BambuLabCondition;
  direction?: number;
  attr?: string;
}

export function buildConditionData(hass: HomeAssistant, config: BambuLabConfig, condition: BambuLabCondition | string): StatData {
  const entity = (suffix: string) => getEntity(hass, `${config.base_entity}${suffix}`);
  let printerStatus = entity('_print_status')?.state ?? 'unknown';

  let cusEntity: HassEntity | undefined;
  let cusAttr: string | undefined;
  let cusName: string | undefined;

  if (config.sensors) {
    const cusSensor = config.sensors[condition];
    if (cusSensor) {
      cusEntity = getEntity(hass, cusSensor['entity']);
      cusAttr = cusEntity?.attributes[cusSensor['attribute']] as string | undefined;
      cusName = cusSensor['name'];
    }

    const cusStatus = config.sensors[BambuLabCondition.Status];
    if (cusStatus) {
      const statusEntity = getEntity(hass, cusStatus['entity']);
      const statusAttr = statusEntity?.attributes[cusStatus['attribute']] as string | undefined;
      printerStatus = statusAttr ?? statusEntity?.state ?? printerStatus;
    }
  }

  switch (condition) {
    case BambuLabCondition.Status:
      return { type: 'stat', name: 'Status', value: cusAttr ?? cusEntity?.state ?? printerStatus };

    case BambuLabCondition.ETA:
      return {
        type: 'time',
        name: cusName || 'ETA',
        timeEntity: cusEntity ?? entity('_end_time'),
        attr: cusAttr,
        condition: BambuLabCondition.ETA,
        direction: 0,
      };

    case BambuLabCondition.Elapsed:
      return {
        type: 'time',
        name: cusName || 'Elapsed',
        timeEntity: cusEntity ?? entity('_print_length'),
        attr: cusAttr,
        condition: BambuLabCondition.Elapsed,
        direction: 1,
      };

    case BambuLabCondition.Remaining:
      return {
        type: 'time',
        name: cusName || 'Remaining',
        timeEntity: cusEntity ?? entity('_end_time'),
        attr: cusAttr,
        condition: BambuLabCondition.Remaining,
        direction: -1,
      };

    case BambuLabCondition.Bed:
      return {
        type: 'temperature',
        name: cusName || 'Bed',
        temperatureEntity: cusEntity ?? entity('_bed_temperature'),
      };

    case BambuLabCondition.Hotend:
      return {
        type: 'temperature',
        name: cusName || 'Hotend',
        temperatureEntity: cusEntity ?? entity('_nozzle_temperature'),
      };

    default:
      return {
        type: 'stat',
        name: cusName || 'Unknown',
        value: cusAttr ?? cusEntity?.state ?? '<unknown>',
      };
  }
}

export function percentComplete(hass: HomeAssistant, config: BambuLabConfig): number {
  if (config.sensors) {
    const cusSensor = config.sensors['Progress'] || config.sensors['progress'];
    if (cusSensor) {
      const cusEntity = getEntity(hass, cusSensor['entity']);
      const cusAttr = cusEntity?.attributes[cusSensor['attribute']];
      if (cusAttr != null) return Number(cusAttr);
      if (cusEntity?.state != null) return Number(cusEntity.state);
    }
  }
  return Number(
    (hass.states[`${config.base_entity}_print_progress`] || { state: -1 }).state
  );
}


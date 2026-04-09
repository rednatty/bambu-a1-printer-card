import { Component, computed, inject, signal } from '@angular/core';
import { ThreedyService } from '../../services/threedy.service';
import { ThreedyCondition } from '../../types';
import { toggleEntity } from '../../utils/toggle';
import { percentComplete } from '../stats/stats-utils';
import { PrinterViewComponent } from '../printer-view/printer-view.component';
import { StatsComponent } from '../stats/stats.component';
import { CameraComponent } from '../camera/camera.component';

@Component({
  selector: 'app-threedy-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  imports: [PrinterViewComponent, StatsComponent, CameraComponent],
})
export class CardComponent {
  private readonly threedy = inject(ThreedyService);

  readonly hiddenOverride = signal(false);
  readonly showVideo = signal(false);

  readonly config = computed(() => this.threedy.config());
  readonly hass = computed(() => this.threedy.hass());

  readonly theme = computed(() => this.config()?.theme || 'Default');
  readonly vertical = computed(() => this.config()?.vertical ?? false);
  readonly round = computed(() => this.config()?.round ?? true);

  readonly percent = computed(() => {
    const hass = this.hass();
    const config = this.config();
    if (!hass || !config) return 0;
    return percentComplete(hass, config);
  });

  readonly displayPercent = computed(() => {
    return this.round() ? Math.round(this.percent()) : this.percent();
  });

  readonly cameraEntity = computed(() => {
    const hass = this.hass();
    const config = this.config();
    if (!config?.camera_entity || !hass) return undefined;
    return hass.states[config.camera_entity];
  });

  readonly state = computed(() => {
    const hass = this.hass();
    const config = this.config();
    if (!hass || !config) return 'unknown';

    let cusAttr: string | undefined;
    let cusEntity: { state: string; attributes: Record<string, unknown> } | undefined;

    if (config.sensors) {
      const cusSensor = config.sensors[ThreedyCondition.Status];
      if (cusSensor) {
        cusEntity = hass.states[cusSensor['entity']];
        cusAttr = cusEntity?.attributes[cusSensor['attribute']] as string | undefined;
      }
    }
    return cusAttr || cusEntity?.state || (hass.states[config.use_mqtt ? `${config.base_entity}_print_status` : `${config.base_entity}_current_state`] || { state: 'unknown' }).state;
  });

  readonly lightOn = computed(() => {
    const config = this.config();
    const hass = this.hass();
    if (!config?.light_entity || !hass) return false;
    return (hass.states[config.light_entity] || { state: 'off' }).state === 'on';
  });

  readonly powerOn = computed(() => {
    const config = this.config();
    const hass = this.hass();
    if (!config?.power_entity || !hass) return false;
    return (hass.states[config.power_entity] || { state: 'off' }).state === 'on';
  });

  readonly hidden = computed(() => {
    return this.state().toLowerCase() !== 'printing' && !this.hiddenOverride();
  });

  readonly statusColor = computed(() => {
    const s = this.state().toLowerCase();
    if (s === 'printing') return '#4caf50';
    if (s === 'unknown') return '#f44336';
    if (s === 'operational' || s === 'idle') return '#00bcd4';
    return '#ffc107';
  });

  readonly borderRadius = computed(() => {
    return this.theme() === 'Neumorphic' ? 16 : 4;
  });

  readonly cardBorderRadius = computed(() => {
    return this.hidden() ? this.borderRadius() : this.borderRadius() * 2;
  });

  readonly boxShadow = computed(() => {
    if (this.theme() === 'Neumorphic') {
      const hass = this.hass();
      const darkMode = hass?.themes?.darkMode ?? false;
      return darkMode
        ? '-5px -5px 8px rgba(50, 50, 50,.2),5px 5px 8px rgba(0,0,0,.08)'
        : '-4px -4px 8px rgba(255,255,255,.5),5px 5px 8px rgba(0,0,0,.03)';
    }
    return 'var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) )';
  });

  readonly headerJustify = computed(() => {
    const config = this.config();
    return config?.power_entity || config?.light_entity ? 'space-between' : 'center';
  });

  constructor() {
    // Initialize hiddenOverride from config
    const config = this.config();
    if (config?.always_show) {
      this.hiddenOverride.set(true);
    }
  }

  toggleHiddenOverride(): void {
    this.hiddenOverride.update((v) => !v);
  }

  toggleVideoVisibility(): void {
    this.showVideo.update((v) => !v);
  }

  hideVideo(): void {
    this.showVideo.set(false);
  }

  onTogglePower(): void {
    const hass = this.hass();
    const config = this.config();
    if (hass && config?.power_entity) {
      toggleEntity(hass, config.power_entity);
    }
  }

  onToggleLight(): void {
    const hass = this.hass();
    const config = this.config();
    if (hass && config?.light_entity) {
      toggleEntity(hass, config.light_entity);
    }
  }

  get toggleVideoFn(): () => void {
    return this.config()?.camera_entity ? () => this.toggleVideoVisibility() : () => {};
  }

  get hideVideoFn(): () => void {
    return () => this.hideVideo();
  }
}


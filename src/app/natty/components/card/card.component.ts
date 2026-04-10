import { Component, computed, inject, signal } from '@angular/core';
import { BambuLabCondition } from '../../types';
import { BambuLabService } from '../../services/bambu-lab.service';
import { toggleEntity } from '../../utils/toggle';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-bambu-lab-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  imports: [StatsComponent],
})
export class CardComponent {
  private readonly bambuLab = inject(BambuLabService);

  readonly config = computed(() => this.bambuLab.config());
  readonly hass = computed(() => this.bambuLab.hass());

  readonly vertical = computed(() => this.config()?.vertical ?? false);

  readonly state = computed(() => {
    const hass = this.hass();
    const config = this.config();
    if (!hass || !config) return 'unknown';

    let cusAttr: string | undefined;
    let cusEntity: { state: string; attributes: Record<string, unknown> } | undefined;

    if (config.sensors) {
      const cusSensor = config.sensors[BambuLabCondition.Status];
      if (cusSensor) {
        cusEntity = hass.states[cusSensor['entity']];
        cusAttr = cusEntity?.attributes[cusSensor['attribute']] as string | undefined;
      }
    }
    return cusAttr || cusEntity?.state || (hass.states[`${config.base_entity}_print_status`] || { state: 'unknown' }).state;
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

  readonly statusColor = computed(() => {
    const s = this.state().toLowerCase();
    if (s === 'printing') return '#4caf50';
    if (s === 'unknown') return '#f44336';
    if (s === 'operational' || s === 'idle') return '#00bcd4';
    return '#ffc107';
  });

  readonly cardBorderRadius = signal(4);

  readonly boxShadow = computed(() =>
    'var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) )'
  );

  readonly headerJustify = computed(() => {
    const config = this.config();
    return config?.power_entity || config?.light_entity ? 'space-between' : 'center';
  });


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

}


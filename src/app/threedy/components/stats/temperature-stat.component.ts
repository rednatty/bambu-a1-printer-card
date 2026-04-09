import { Component, computed, inject, input } from '@angular/core';
import { StatComponent } from './stat.component';
import { ThreedyService } from '../../services/threedy.service';
import { HassEntity, ThreedyConfig } from '../../types';
import { formatTemperature } from './stats-utils';

@Component({
  selector: 'app-temperature-stat',
  templateUrl: './temperature-stat.component.html',
  imports: [StatComponent],
})
export class TemperatureStatComponent {
  private readonly threedy = inject(ThreedyService);

  readonly name = input.required<string>();
  readonly temperatureEntity = input.required<HassEntity | undefined>();

  readonly formattedValue = computed(() => {
    const entity = this.temperatureEntity();
    const config = this.threedy.config();
    if (!entity || !config) return '-';
    return formatTemperature(entity, config);
  });
}


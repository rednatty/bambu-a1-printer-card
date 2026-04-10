import { Component, computed, inject, input } from '@angular/core';
import { StatComponent } from './stat/stat.component';
import { BambuLabService } from '../../services/bambu-lab.service';
import { HassEntity } from '../../types';
import { formatTemperature } from './stats-utils';

@Component({
  selector: 'app-temperature-stat',
  templateUrl: './temperature-stat.component.html',
  imports: [StatComponent],
})
export class TemperatureStatComponent {
  private readonly bambuLab = inject(BambuLabService);

  readonly name = input.required<string>();
  readonly temperatureEntity = input.required<HassEntity | undefined>();

  readonly formattedValue = computed(() => {
    const entity = this.temperatureEntity();
    const config = this.bambuLab.config();
    if (!entity || !config) return '-';
    return formatTemperature(entity, config);
  });
}


import { Component, computed, inject, input } from '@angular/core';
import { BambuLabService } from '../../services/bambu-lab.service';
import { StatComponent } from './stat/stat.component';
import { TemperatureStatComponent } from './temperature-stat.component';
import { TimeStatComponent } from './time-stat.component';
import { buildConditionData, percentComplete, StatData } from './stats-utils';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  imports: [StatComponent, TemperatureStatComponent, TimeStatComponent],
})
export class StatsComponent {
  private readonly bambuLab = inject(BambuLabService);

  readonly showPercent = input(true);

  readonly percent = computed(() => {
    const hass = this.bambuLab.hass();
    const config = this.bambuLab.config();
    if (!hass || !config) return 0;
    return percentComplete(hass, config);
  });

  readonly roundedPercent = computed(() => {
    const config = this.bambuLab.config();
    const round = config?.round ?? true;
    return round ? Math.round(this.percent()) : this.percent();
  });

  readonly statItems = computed<StatData[]>(() => {
    const hass = this.bambuLab.hass();
    const config = this.bambuLab.config();
    if (!hass || !config || !config.monitored) return [];
    return config.monitored.map((condition) => buildConditionData(hass, config, condition));
  });
}


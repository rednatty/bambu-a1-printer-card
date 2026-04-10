import { Component, computed, inject } from '@angular/core';
import { BambuLabService } from '../../services/bambu-lab.service';
import { StatComponent } from './stat/stat.component';
import { TemperatureStatComponent } from './temperature-stat.component';
import { TimeStatComponent } from './time-stat.component';
import { buildConditionData, StatData } from './stats-utils';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  imports: [StatComponent, TemperatureStatComponent, TimeStatComponent],
})
export class StatsComponent {
  private readonly bambuLab = inject(BambuLabService);


  readonly statItems = computed<StatData[]>(() => {
    const hass = this.bambuLab.hass();
    const config = this.bambuLab.config();
    if (!hass || !config || !config.monitored) return [];
    return config.monitored.map((condition) => buildConditionData(hass, config, condition));
  });
}


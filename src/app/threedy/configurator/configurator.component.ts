import { Component, computed, effect, input, signal } from '@angular/core';
import { HomeAssistant, ThreedyCondition, ThreedyConfig, ThreedyPrinter, ThreedyTheme } from '../types';
import { getCameras, getPrinters, getToggleables, printerName, updateConfig } from './configurator-utils';
import { CfgButtonComponent } from './components/button/cfg-button.component';
import { CfgInputComponent } from './components/input/cfg-input.component';
import { CfgSelectComponent } from './components/select/cfg-select.component';
import { YesNoSelectComponent } from './components/yes-no-select/yes-no-select.component';
import { MultiSelectorComponent } from './components/multi-selector/multi-selector.component';
import { FewSelectorComponent } from './components/few-selector/few-selector.component';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.scss',
  imports: [
    CfgButtonComponent,
    CfgInputComponent,
    CfgSelectComponent,
    YesNoSelectComponent,
    MultiSelectorComponent,
    FewSelectorComponent,
  ],
})
export class ConfiguratorComponent {
  readonly hass = input.required<HomeAssistant>();
  readonly config = input<ThreedyConfig>();
  readonly threedyElement = input.required<HTMLElement>();

  readonly modifiedConfig = signal<ThreedyConfig | undefined>(undefined);
  readonly advancedShown = signal(false);

  readonly ThreedyPrinter = ThreedyPrinter;
  readonly ThreedyCondition = ThreedyCondition;
  readonly ThreedyTheme = ThreedyTheme;

  readonly printers = computed(() => getPrinters(this.hass()));
  readonly toggleables = computed(() => getToggleables(this.hass()));
  readonly cameras = computed(() => getCameras(this.hass()));

  readonly initialPrinterName = computed(() => printerName(this.config()?.base_entity));

  constructor() {
    effect(() => {
      const cfg = this.config();
      this.modifiedConfig.set(cfg);
    });
  }

  updateConfigValue(key: string, value: unknown): void {
    const mc = this.modifiedConfig();
    if (!mc) return;
    const updated = updateConfig(this.threedyElement(), mc, { [key]: value } as Partial<ThreedyConfig>);
    this.modifiedConfig.set(updated);
  }

  readonly scaleOptions: Record<string, unknown> = { '0.5': 0.5, '0.75': 0.75, '1.0': 1.0 };
  readonly yesNoOptions: Record<string, unknown> = { No: false, Yes: true };
  readonly tempUnitOptions: Record<string, unknown> = { '°C': 'C', '°F': 'F' };
}


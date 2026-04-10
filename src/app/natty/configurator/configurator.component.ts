import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BambuLabCondition, BambuLabConfig, HomeAssistant } from '../types';
import {
  getPrinters,
  getToggleables,
  printerName,
  updateConfig,
} from './configurator-utils';
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
  encapsulation: ViewEncapsulation.ShadowDom,
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
  private readonly destroyRef = inject(DestroyRef);

  readonly hass = input.required<HomeAssistant>();
  readonly config = input<BambuLabConfig>();
  readonly bambuLabElement = input.required<HTMLElement>();

  readonly modifiedConfig = signal<BambuLabConfig | undefined>(undefined);
  readonly advancedShown = signal(false);

  readonly BambuLabCondition = BambuLabCondition;

  readonly printers = computed(() => getPrinters(this.hass()));
  readonly toggleables = computed(() => getToggleables(this.hass()));

  readonly initialPrinterName = computed(() =>
    printerName(this.config()?.base_entity),
  );

  constructor() {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        this.advancedShown.set(false);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    });

    effect(() => {
      const cfg = this.config();
      this.modifiedConfig.set(cfg);
    });
  }

  updateConfigValue(key: string, value: unknown): void {
    const mc = this.modifiedConfig();
    if (!mc) return;
    const updated = updateConfig(this.bambuLabElement(), mc, {
      [key]: value,
    } as Partial<BambuLabConfig>);
    this.modifiedConfig.set(updated);
  }

  readonly yesNoOptions: Record<string, unknown> = { No: false, Yes: true };
  readonly tempUnitOptions: Record<string, unknown> = { '°C': 'C', '°F': 'F' };
}

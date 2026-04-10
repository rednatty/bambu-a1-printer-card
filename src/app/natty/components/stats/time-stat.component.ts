import { Component, DestroyRef, effect, inject, Injector, input, OnInit, signal } from '@angular/core';

import { BambuLabCondition, HassEntity } from '../../types';
import { BambuLabService } from '../../services/bambu-lab.service';
import { getTotalSeconds, renderTime } from './stats-utils';
import { StatComponent } from './stat/stat.component';

@Component({
  selector: 'app-time-stat',
  templateUrl: './time-stat.component.html',
  imports: [StatComponent],
})
export class TimeStatComponent implements OnInit {
  private readonly bambuLab = inject(BambuLabService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  readonly name = input.required<string>();
  readonly timeEntity = input.required<HassEntity | undefined>();
  readonly condition = input.required<BambuLabCondition>();
  readonly direction = input<number>(0);
  readonly attr = input<string | undefined>(undefined);

  readonly time = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    effect(() => {
      const entity = this.timeEntity();
      const attrVal = this.attr();
      const totalSeconds = getTotalSeconds(entity, attrVal);

      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }

      this.time.set(totalSeconds);

      const dir = this.direction();
      this.intervalId = setInterval(() => {
        this.time.update((t) => t + dir);
      }, 1000);
    }, { injector: this.injector });

    this.destroyRef.onDestroy(() => {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
    });
  }

  get showEmpty(): boolean {
    return this.time() <= 0;
  }

  get formattedValue(): string {
    if (this.showEmpty) return '-';
    const config = this.bambuLab.config();
    if (!config) return '-';
    return renderTime(this.time(), this.condition(), config);
  }
}


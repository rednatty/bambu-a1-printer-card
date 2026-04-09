import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ThreedyService } from '../../services/threedy.service';
import { ThreedyCondition } from '../../types';
import { getBambuA1Dimensions, BambuA1Dimensions } from './bambu-a1-utils';

@Component({
  selector: 'app-bambu-a1-printer',
  templateUrl: './bambu-a1.component.html',
  styleUrl: './bambu-a1.component.scss',
})
export class BambuA1Component implements OnInit {
  private readonly threedy = inject(ThreedyService);
  private readonly destroyRef = inject(DestroyRef);

  readonly printerConfig = input.required<Record<string, unknown>>();

  readonly dimensions = signal<BambuA1Dimensions | undefined>(undefined);
  readonly toolheadXPos = signal(0);
  private animationId = 0;
  private resizeObserver?: ResizeObserver;

  readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('container');

  readonly printing = computed(() => {
    const hass = this.threedy.hass();
    const config = this.threedy.config();
    if (!hass || !config) return false;

    let state = '';
    if (config.sensors) {
      const cusSensor = config.sensors[ThreedyCondition.Status];
      if (cusSensor) {
        const entity = hass.states[cusSensor['entity']];
        state = (entity?.attributes[cusSensor['attribute']] as string) || entity?.state || '';
      }
    }
    if (!state) {
      state = (hass.states[config.use_mqtt ? `${config.base_entity}_print_status` : `${config.base_entity}_current_state`] || { state: 'unknown' }).state;
    }
    return state.toLowerCase() === 'printing';
  });

  readonly progress = computed(() => {
    const hass = this.threedy.hass();
    const config = this.threedy.config();
    if (!hass || !config) return 0;

    let val: number | string = 0;
    if (config.sensors) {
      const cusProgress = config.sensors['Progress'] || config.sensors['progress'];
      if (cusProgress) {
        const entity = hass.states[cusProgress['entity']];
        val = (entity?.attributes[cusProgress['attribute']] as number) || entity?.state || 0;
      }
    }
    if (!val) {
      val = (hass.states[config.use_mqtt ? `${config.base_entity}_print_progress` : `${config.base_entity}_job_percentage`] || { state: 0 }).state;
    }
    return Number(val) / 100;
  });

  ngOnInit(): void {
    effect(() => {
      const dims = this.dimensions();
      const isPrinting = this.printing();
      if (dims && isPrinting) {
        this.startToolheadAnimation(dims.BuildPlate.width);
      } else {
        this.stopToolheadAnimation();
      }
    });

    this.setupResizeObserver();

    this.destroyRef.onDestroy(() => {
      this.stopToolheadAnimation();
      this.resizeObserver?.disconnect();
    });
  }

  private setupResizeObserver(): void {
    effect(() => {
      const el = this.containerRef();
      if (!el) return;

      this.resizeObserver?.disconnect();
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const config = this.threedy.config();
          if (width > 0 && height > 0) {
            this.dimensions.set(
              getBambuA1Dimensions(
                this.printerConfig(),
                { width, height },
                config?.scale || 1.0
              )
            );
          }
        }
      });
      this.resizeObserver.observe(el.nativeElement);
    });
  }

  private startToolheadAnimation(maxWidth: number): void {
    this.stopToolheadAnimation();
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) % (duration * 2);
      const fraction = elapsed < duration ? elapsed / duration : 2 - elapsed / duration;
      this.toolheadXPos.set(fraction * maxWidth);
      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  private stopToolheadAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }
}


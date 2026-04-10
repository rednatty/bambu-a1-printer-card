import { Component, computed, inject, input } from '@angular/core';
import { BambuLabService } from '../../services/bambu-lab.service';
import { BambuA1Component } from '../../printer/bambu-a1/bambu-a1.component';

@Component({
  selector: 'app-printer-view',
  templateUrl: './printer-view.component.html',
  styleUrl: './printer-view.component.scss',
  imports: [BambuA1Component],
})
export class PrinterViewComponent {
  private readonly bambuLab = inject(BambuLabService);

  readonly toggleVideo = input.required<() => void>();
  readonly hasCamera = input(false);

  readonly printerConfig = computed(() => {
    const config = this.bambuLab.config();
    return config?.printer_config ?? {};
  });

  onPrinterClick(): void {
    this.toggleVideo()();
  }
}


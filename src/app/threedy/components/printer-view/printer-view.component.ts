import { Component, computed, inject, input } from '@angular/core';
import { ThreedyService } from '../../services/threedy.service';
import { I3Component } from '../../printers/i3/i3.component';
import { CantileverComponent } from '../../printers/cantilever/cantilever.component';
import { BambuA1Component } from '../../printers/bambu-a1/bambu-a1.component';
import { PRINTER_DEFAULTS } from '../../printers/defaults/printer-defaults';

@Component({
  selector: 'app-printer-view',
  templateUrl: './printer-view.component.html',
  styleUrl: './printer-view.component.scss',
  imports: [I3Component, CantileverComponent, BambuA1Component],
})
export class PrinterViewComponent {
  private readonly threedy = inject(ThreedyService);

  readonly toggleVideo = input.required<() => void>();
  readonly hasCamera = input(false);

  readonly printerType = computed(() => this.threedy.config()?.printer_type || 'I3');

  readonly printerConfig = computed(() => {
    const config = this.threedy.config();
    const type = this.printerType();
    return config?.printer_config || PRINTER_DEFAULTS[type] || PRINTER_DEFAULTS['I3'];
  });

  onPrinterClick(): void {
    this.toggleVideo()();
  }
}


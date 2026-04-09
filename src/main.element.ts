import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideZonelessChangeDetection } from '@angular/core';
import { BambuCardHostComponent } from './app/bambu-card-host.component';
import { BambuEditorHostComponent } from './app/bambu-editor-host.component';

(async () => {
  const appRef = await createApplication({
    providers: [
      provideZonelessChangeDetection(),
    ],
  });

  const BambuCardElement = createCustomElement(BambuCardHostComponent, {
    injector: appRef.injector,
  });

  const BambuEditorElement = createCustomElement(BambuEditorHostComponent, {
    injector: appRef.injector,
  });

  // Add HA card protocol methods to the card element
  BambuCardElement.prototype.setConfig = function (config: unknown) {
    this.config = config;
  };

  BambuCardElement.prototype.getCardSize = function () {
    return 2;
  };

  (BambuCardElement as unknown as { getConfigElement: () => HTMLElement }).getConfigElement = () => {
    return document.createElement('bambu-printer-card-editor');
  };

  // Add HA editor protocol methods to the editor element
  BambuEditorElement.prototype.setConfig = function (config: unknown) {
    this.config = config;
  };

  // Register custom elements
  customElements.define('bambu-printer-card', BambuCardElement);
  customElements.define('bambu-printer-card-editor', BambuEditorElement);

  // Register with HA custom cards registry
  const win = window as unknown as Record<string, unknown[]>;
  win['customCards'] = win['customCards'] || [];
  win['customCards'].push({
    type: 'bambu-printer-card',
    name: 'Bambu Printer Card',
    preview: false,
    description: 'Bambu Lab 3D Printer Card for Home Assistant',
  });
})();


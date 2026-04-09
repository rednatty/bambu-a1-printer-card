export const PRINTER_DEFAULTS: Record<string, Record<string, unknown>> = {
  I3: {
    top: { width: 350, height: 20 },
    bottom: { width: 350, height: 52.3 },
    left: { width: 40, height: 405 },
    right: { width: 40, height: 405 },
    buildplate: { maxWidth: 235, maxHeight: 250, verticalOffset: 55 },
    xAxis: {
      stepper: true,
      width: 420,
      offsetLeft: -40,
      height: 20,
      extruder: { width: 60, height: 60 },
    },
  },
  Cantilever: {
    ZAxis: { height: 240, width: 80, offsetLeft: 0 },
    Bottom: { width: 220, height: 80 },
    BuildPlate: { maxWidth: 120, maxHeight: 120, verticalOffset: 20, horizontalOffset: 20 },
    XAxis: {
      width: 260,
      offsetLeft: 0,
      height: 60,
      extruder: { width: 40, height: 60, offsetY: 20 },
    },
  },
  BambuA1: {
    frame: { width: 380, height: 420, cornerRadius: 12 },
    lid: { height: 30 },
    base: { height: 60 },
    buildplate: { maxWidth: 256, maxHeight: 256, verticalOffset: 40 },
    xRail: {
      width: 320,
      height: 16,
      offsetLeft: -10,
    },
    toolhead: { width: 50, height: 50 },
    nozzle: { width: 14, height: 14 },
    spool: { width: 40, height: 60, offsetRight: 30 },
  },
};


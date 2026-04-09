import { Scale } from '../../utils/scale';

export interface I3Dimensions {
  Scalable: { width: number; height: number };
  Frame: { width: number; height: number };
  Hole: { width: number; height: number; left: number; top: number };
  BuildArea: { width: number; height: number; left: number; top: number };
  BuildPlate: { width: number; left: number; top: number };
  XAxis: { width: number; height: number; left: number; top: number };
  Track: { width: number; height: number };
  Basis: { Y: number; X: number };
  Gantry: { width: number; height: number; left: number; top: number };
  Nozzle: { width: number; height: number; left: number; top: number };
  GantryMaxLeft: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getI3Dimensions(config: any, bounds: { width: number; height: number }, haScaleFactor: number): I3Dimensions {
  const scale = new Scale((bounds.height / (config.top.height + config.bottom.height + config.left.height)) * haScaleFactor);

  const F_W = scale.val(config.top.width);
  const F_H = scale.val(config.top.height + config.bottom.height + config.left.height);

  const S_ML = (bounds.width - F_W) / 2;
  const S_MT = (bounds.height - F_H) / 2;

  const H_W = scale.val(config.top.width - (config.left.width + config.right.width));
  const H_H = scale.val(config.left.height);
  const H_L = scale.val(config.left.width);
  const H_T = scale.val(config.top.height);

  const BASIS_Y = scale.val(config.top.height - config.buildplate.verticalOffset) + H_H;

  const B_W = scale.val(config.buildplate.maxWidth);
  const B_H = scale.val(config.buildplate.maxHeight);
  const B_L = scale.val(config.left.width + (scale.og(H_W) - config.buildplate.maxWidth) / 2);
  const B_T = BASIS_Y - scale.val(config.buildplate.maxHeight);

  const P_W = B_W;
  const P_L = B_L;
  const P_T = BASIS_Y;

  const X_W = scale.val(config.xAxis.width);
  const X_H = scale.val(config.xAxis.height);
  const X_L = scale.val(config.xAxis.offsetLeft);

  const T_W = X_W;
  const T_H = X_H;

  const E_W = scale.val(config.xAxis.extruder.width);
  const E_H = scale.val(config.xAxis.extruder.height);
  const E_L = P_L - E_W / 2;
  const E_M = E_L + B_W;

  const N_W = scale.val(12);
  const N_H = scale.val(12);
  const N_L = (E_W - N_W) / 2;
  const N_T = E_H;

  const E_T = P_T - E_H - N_H;
  const X_T = E_T + E_H / 2 - X_H / 2;

  return {
    Scalable: { width: F_W, height: F_H },
    Frame: { width: F_W, height: F_H },
    Hole: { width: H_W, height: H_H, left: H_L, top: H_T },
    BuildArea: { width: B_W, height: B_H, left: B_L, top: B_T },
    BuildPlate: { width: P_W, left: P_L, top: P_T },
    XAxis: { width: X_W, height: X_H, left: X_L, top: X_T },
    Track: { width: T_W, height: T_H },
    Basis: { Y: BASIS_Y, X: BASIS_Y + scale.val((config.xAxis.extruder.height - config.xAxis.height) / 2 - (config.xAxis.extruder.height + 12)) },
    Gantry: { width: E_W, height: E_H, left: E_L, top: E_T },
    Nozzle: { width: N_W, height: N_H, left: N_L, top: N_T },
    GantryMaxLeft: E_M,
  };
}


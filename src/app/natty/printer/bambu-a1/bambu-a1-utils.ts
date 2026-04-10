import { Scale } from '../../utils/scale';

export interface BambuA1Dimensions {
  Scalable: { width: number; height: number };
  Frame: { width: number; height: number; cornerRadius: number };
  Lid: { width: number; height: number };
  Base: { width: number; height: number; top: number };
  BuildArea: { width: number; height: number; left: number; top: number };
  BuildPlate: { width: number; left: number; top: number };
  XRail: { width: number; height: number; left: number; top: number };
  Toolhead: { width: number; height: number; left: number; top: number };
  Nozzle: { width: number; height: number; left: number; top: number };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getBambuA1Dimensions(config: any, bounds: { width: number; height: number }, haScaleFactor: number): BambuA1Dimensions {
  const scale = new Scale((bounds.height / config.frame.height) * haScaleFactor);

  const F_W = scale.val(config.frame.width);
  const F_H = scale.val(config.frame.height);
  const F_CR = scale.val(config.frame.cornerRadius);

  const LID_W = F_W;
  const LID_H = scale.val(config.lid.height);

  const BASE_W = F_W;
  const BASE_H = scale.val(config.base.height);
  const BASE_T = F_H - BASE_H;

  // Build area sits inside the frame
  const B_W = scale.val(config.buildplate.maxWidth);
  const B_H = scale.val(config.buildplate.maxHeight);
  const B_L = (F_W - B_W) / 2;
  const B_T = LID_H + scale.val(config.buildplate.verticalOffset);

  // Build plate (thin line at bottom of build area)
  const P_W = B_W;
  const P_L = B_L;
  const P_T = B_T + B_H;

  // X rail
  const X_W = scale.val(config.xRail.width);
  const X_H = scale.val(config.xRail.height);
  const X_L = (F_W - X_W) / 2 + scale.val(config.xRail.offsetLeft);

  // Toolhead
  const TH_W = scale.val(config.toolhead.width);
  const TH_H = scale.val(config.toolhead.height);
  const TH_L = B_L - TH_W / 2; // starting position at left edge of build area

  // Nozzle (centered below toolhead)
  const N_W = scale.val(config.nozzle.width);
  const N_H = scale.val(config.nozzle.height);
  const N_L = (TH_W - N_W) / 2;
  const N_T = TH_H;

  // Toolhead and rail vertical position
  const TH_T = P_T - TH_H - N_H;
  const X_T = TH_T + TH_H / 2 - X_H / 2;

  return {
    Scalable: { width: F_W, height: F_H },
    Frame: { width: F_W, height: F_H, cornerRadius: F_CR },
    Lid: { width: LID_W, height: LID_H },
    Base: { width: BASE_W, height: BASE_H, top: BASE_T },
    BuildArea: { width: B_W, height: B_H, left: B_L, top: B_T },
    BuildPlate: { width: P_W, left: P_L, top: P_T },
    XRail: { width: X_W, height: X_H, left: X_L, top: X_T },
    Toolhead: { width: TH_W, height: TH_H, left: TH_L, top: TH_T },
    Nozzle: { width: N_W, height: N_H, left: N_L, top: N_T },
  };
}


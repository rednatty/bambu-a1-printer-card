export enum HapticStrength {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
}

export function fireHaptic(hapticStrength: HapticStrength = HapticStrength.Medium): void {
  const event = new Event('haptic') as Event & { detail: HapticStrength };
  (event as unknown as Record<string, unknown>)['detail'] = hapticStrength;

  window?.dispatchEvent(event);
}


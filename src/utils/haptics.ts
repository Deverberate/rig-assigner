/**
 * Lightweight haptic feedback utility using navigator.vibrate.
 * Gracefully no-ops on unsupported browsers (desktop, older mobile).
 */

function vibrate(pattern: number | number[]): void {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently ignore — desktop browsers, restricted contexts
  }
}

/** 8ms subtle tick — for chip taps, search input, toggles */
export function triggerLightHaptic(): void {
  vibrate(8);
}

/** 20ms pulse — for step forward, component swap, copy spec sheet */
export function triggerMediumHaptic(): void {
  vibrate(20);
}

/** 15ms-50ms-25ms pattern — for quiz completion / matching result */
export function triggerSuccessHaptic(): void {
  vibrate([15, 50, 25]);
}

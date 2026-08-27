/**
 * Lightweight haptic feedback utility using navigator.vibrate.
 * Gracefully no-ops on unsupported browsers (desktop, older mobile, SSR).
 */

export const triggerLightHaptic = () => {
  if (typeof window !== 'undefined' && navigator && 'vibrate' in navigator) {
    try {
      navigator.vibrate(15);
    } catch (e) {
      // Silently fallback if blocked by browser policies
    }
  }
};

export const triggerMediumHaptic = () => {
  if (typeof window !== 'undefined' && navigator && 'vibrate' in navigator) {
    try {
      navigator.vibrate(35);
    } catch (e) {
      // Silently fallback
    }
  }
};

export const triggerSuccessHaptic = () => {
  if (typeof window !== 'undefined' && navigator && 'vibrate' in navigator) {
    try {
      navigator.vibrate([30, 50, 40]);
    } catch (e) {
      // Silently fallback
    }
  }
};

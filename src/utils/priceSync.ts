/**
 * Lightweight client-side price sync utility.
 * Tracks last price check in localStorage and provides a "last updated" indicator.
 * Uses APP_VERSION for cache-busting — when the version changes, stale data is cleared.
 */

export const APP_VERSION = "1.0.0";
const VERSION_KEY = "rigassigner_app_version";
const STORAGE_KEY = "rigassigner_price_sync";
const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Clear stale cache if the app version has changed. */
function checkVersionBust(): void {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored !== APP_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    }
  } catch {
    // ignore
  }
}

interface PriceSyncData {
  lastSyncTimestamp: number;
  syncCount: number;
  /** Simulated variance factor (0.97–1.03) applied on each sync */
  varianceFactor: number;
}

function loadData(): PriceSyncData {
  checkVersionBust();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    lastSyncTimestamp: Date.now(),
    syncCount: 0,
    varianceFactor: 1,
  };
}

function saveData(data: PriceSyncData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Check if a sync is needed (last sync > 24h ago).
 */
export function needsSync(): boolean {
  const data = loadData();
  return Date.now() - data.lastSyncTimestamp > SYNC_INTERVAL_MS;
}

/**
 * Trigger a price sync. Simulates daily market variance (±2–3%).
 * In a real app this would fetch from a remote API.
 */
export function syncPrices(): PriceSyncData {
  const data = loadData();
  // Simulate ±2-3% daily market variance
  const variance = 0.97 + Math.random() * 0.06; // 0.97 to 1.03
  const updated: PriceSyncData = {
    lastSyncTimestamp: Date.now(),
    syncCount: data.syncCount + 1,
    varianceFactor: variance,
  };
  saveData(updated);
  return updated;
}

/**
 * Get the current price variance factor.
 * Prices in the catalog are multiplied by this factor for display.
 */
export function getVarianceFactor(): number {
  const data = loadData();
  return data.varianceFactor;
}

/**
 * Get a human-readable "last updated" string.
 */
export function getLastUpdatedLabel(): string {
  const data = loadData();
  const diff = Date.now() - data.lastSyncTimestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Check if sync is active (synced within last 24h).
 */
export function isSyncActive(): boolean {
  const data = loadData();
  return Date.now() - data.lastSyncTimestamp < SYNC_INTERVAL_MS;
}

/**
 * Auto-sync on app load if needed.
 */
export function autoSync(): void {
  if (needsSync()) {
    syncPrices();
  }
}

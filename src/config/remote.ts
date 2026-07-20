/** R2 Worker Proxy のベース URL */
export const REMOTE_BASE_URL = "https://geo-data-push.htlost8.workers.dev/data";

/** 各エンドポイント */
export const VERSION_URL = `${REMOTE_BASE_URL}/version.json`;
export const MANIFEST_URL = `${REMOTE_BASE_URL}/manifest.json`;

/** relativePath から完全な GeoJSON URL を組み立て */
export const geojsonUrl = (relativePath: string): string =>
  `${REMOTE_BASE_URL}/${relativePath}`;

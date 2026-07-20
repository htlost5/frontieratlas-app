import fs from "fs";
import path from "path";
import unzipper from "unzipper";
import { fileURLToPath } from "url";

import { generateGeojsonAssetMap } from "./generate_geojsonAssetMap.js";

const versionConfig = JSON.parse(
  fs.readFileSync(new URL("../config/geo-data-version.json", import.meta.url)),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let { version } = versionConfig;

if (!version) {
  console.error("GetError: version情報を記載してください");
  process.exit(1);
}

const releasesDir = path.resolve(__dirname, "../../tools/map-assets/releases");

if (version === "latest") {
  const latestPath = path.join(releasesDir, "latest.json");
  const latestConfig = JSON.parse(fs.readFileSync(latestPath, "utf8"));
  version = latestConfig.version;
}

const zipPath = path.join(releasesDir, version, `imdf-${version}.zip`);

const storagePath = path.join(__dirname, "../assets", "maps");

async function resetDir() {
  if (fs.existsSync(storagePath)) {
    fs.rmSync(storagePath, { recursive: true, force: true });
    console.log(`[RESET] ${storagePath} deleted`);
  }
  fs.mkdirSync(storagePath, { recursive: true });
}

async function getData() {
  const buffer = fs.readFileSync(zipPath);

  // zip解凍
  const directory = await unzipper.Open.buffer(buffer);
  await directory.extract({ path: storagePath, concurrency: 5 });

  console.log("Assets updated successfully");
}

async function main() {
  try {
    await resetDir();
    await getData();
    await generateGeojsonAssetMap();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();

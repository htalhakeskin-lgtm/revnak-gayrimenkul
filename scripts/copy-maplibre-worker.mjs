// MapLibre GL v6 web worker'ını public/ altına kopyalar (predev / prebuild).
// Worker, paketlenmiş JS'nin yanında aranır; Next.js bunu otomatik sunmadığı için
// statik dosya olarak servis edilir. Sürüm package.json ile senkron kalır.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const pkgDir = dirname(require.resolve("maplibre-gl/package.json"));
const target = join("public", "vendor");

mkdirSync(target, { recursive: true });
copyFileSync(join(pkgDir, "dist", "maplibre-gl-worker.mjs"), join(target, "maplibre-gl-worker.mjs"));
console.log("maplibre-gl-worker.mjs → public/vendor/");

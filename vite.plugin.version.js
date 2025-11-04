import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function versionPlugin() {
  return {
    name: "version-plugin",
    closeBundle() {
      const version = Date.now(); // unique timestamp
      const filePath = path.resolve(__dirname, "dist/version.json");
      writeFileSync(filePath, JSON.stringify({ version }), "utf-8");
    },
  };
}
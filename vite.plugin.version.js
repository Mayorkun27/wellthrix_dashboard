import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function versionPlugin() {
  return {
    name: "version-plugin",
    closeBundle() {
      const version = Date.now(); // unique timestamp
      const distPath = path.resolve(__dirname, "dist");
      const filePath = path.join(distPath, "version.json");
      
      // Ensure the 'dist' directory exists
      if (!existsSync(distPath)) {
        mkdirSync(distPath, { recursive: true });
      }
      
      writeFileSync(filePath, JSON.stringify({ version }), "utf-8");
    },
  };
}
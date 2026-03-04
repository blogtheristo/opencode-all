import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const canonicalRoot = path.join(repoRoot, "landing-pages", "dws10.com");
const targets = [
  path.join(repoRoot, "landing-pages", "dws10-com"),
  path.join(repoRoot, "dws10.com"),
];

const isDirectory = async (entryPath) => {
  try {
    const stats = await stat(entryPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

const hasIndexFile = async (dirPath) => {
  try {
    const stats = await stat(path.join(dirPath, "index.html"));
    return stats.isFile();
  } catch {
    return false;
  }
};

// Rule 9: Never publish .md files to public deployment paths
const EXCLUDED_EXTENSIONS = ['.md'];

const sync = async () => {
  const entries = await readdir(canonicalRoot);
  const folders = [];

  for (const entry of entries) {
    // Exclude .md files from sync — Rule 9: no markdown in public paths
    if (EXCLUDED_EXTENSIONS.some(ext => entry.endsWith(ext))) continue;

    const entryPath = path.join(canonicalRoot, entry);
    if (await isDirectory(entryPath) && (await hasIndexFile(entryPath))) {
      folders.push(entry);
    }
  }

  for (const folder of folders) {
    const source = path.join(canonicalRoot, folder, "index.html");

    for (const targetRoot of targets) {
      const targetFolder = path.join(targetRoot, folder);
      const targetFile = path.join(targetFolder, "index.html");

      await mkdir(targetFolder, { recursive: true });
      await copyFile(source, targetFile);
    }
  }

  console.log(`Synced ${folders.length} landing page folders.`);
};

sync().catch((error) => {
  console.error("Landing page sync failed:", error);
  process.exit(1);
});

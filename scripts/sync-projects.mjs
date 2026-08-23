import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'images');
const projectsDir = path.join(imagesDir, 'projects');
const orgsDir = path.join(imagesDir, 'organizations');
const profileDir = path.join(imagesDir, 'profile');

const projectOutputFile = path.join(rootDir, 'src', 'data', 'project-galleries.json');
const orgOutputFile = path.join(rootDir, 'src', 'data', 'organization-logos.json');
const profileOutputFile = path.join(rootDir, 'src', 'data', 'profile-image.json');

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']);

export function syncAllAssets() {
  // 1. Sync Project Galleries
  const galleries = {};
  if (fs.existsSync(projectsDir)) {
    const folders = fs.readdirSync(projectsDir, { withFileTypes: true });
    for (const dirent of folders) {
      if (dirent.isDirectory()) {
        const folderName = dirent.name;
        const folderPath = path.join(projectsDir, folderName);
        const files = fs.readdirSync(folderPath);

        const images = files
          .filter((file) => VALID_EXTENSIONS.has(path.extname(file).toLowerCase()))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
          .map((file) => `/images/projects/${folderName}/${file}`);

        galleries[folderName] = images;
      }
    }
  }

  // 2. Sync Organization Logos (matching seoultech, gist, samsung with ANY extension)
  const orgLogos = {};
  if (fs.existsSync(orgsDir)) {
    const files = fs.readdirSync(orgsDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        const baseName = path.basename(file, ext).toLowerCase();
        orgLogos[baseName] = `/images/organizations/${file}`;
      }
    }
  }

  // 3. Sync Profile Image
  let profileImgPath = '/images/profile/profile.jpg';
  if (fs.existsSync(profileDir)) {
    const files = fs.readdirSync(profileDir);
    const validProfile = files.find((f) =>
      VALID_EXTENSIONS.has(path.extname(f).toLowerCase())
    );
    if (validProfile) {
      profileImgPath = `/images/profile/${validProfile}`;
    }
  }

  const outDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(projectOutputFile, JSON.stringify(galleries, null, 2), 'utf-8');
  fs.writeFileSync(orgOutputFile, JSON.stringify(orgLogos, null, 2), 'utf-8');
  fs.writeFileSync(profileOutputFile, JSON.stringify({ profileImage: profileImgPath }, null, 2), 'utf-8');

  console.log(`[Asset Sync] Synced projects (${Object.keys(galleries).length}), organizations (${Object.keys(orgLogos).length}), profile (${profileImgPath})`);
}

if (process.argv.includes('--watch')) {
  syncAllAssets();
  console.log('[Asset Watcher] Watching public/images/ for changes in real time...');

  let debounceTimer = null;
  const onFileChanged = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      syncAllAssets();
    }, 150);
  };

  if (fs.existsSync(imagesDir)) {
    fs.watch(imagesDir, { recursive: true }, onFileChanged);
  }
} else if (process.argv[1] === __filename) {
  syncAllAssets();
}

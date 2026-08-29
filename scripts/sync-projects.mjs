import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'images');
const projectsDir = path.join(imagesDir, 'projects');
const projectThumbnailsDir = path.join(imagesDir, 'project-thumbnails');
const backgroundThumbnailsDir = path.join(imagesDir, 'background-thumbnails');
const orgsDir = path.join(imagesDir, 'organizations');
const profileDir = path.join(imagesDir, 'profile');

const projectOutputFile = path.join(rootDir, 'src', 'data', 'project-galleries.json');
const projectThumbnailOutputFile = path.join(rootDir, 'src', 'data', 'project-thumbnails.json');
const backgroundThumbnailOutputFile = path.join(rootDir, 'src', 'data', 'background-thumbnails.json');
const orgOutputFile = path.join(rootDir, 'src', 'data', 'organization-logos.json');
const profileOutputFile = path.join(rootDir, 'src', 'data', 'profile-image.json');

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']);
const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function writeJsonIfChanged(filePath, data) {
  const nextContent = `${JSON.stringify(data, null, 2)}\n`;
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf-8') === nextContent) {
    return;
  }

  fs.writeFileSync(filePath, nextContent, 'utf-8');
}

async function createProjectThumbnail(folderName, imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  if (!RASTER_EXTENSIONS.has(ext)) {
    return imagePath;
  }

  if (!fs.existsSync(projectThumbnailsDir)) {
    fs.mkdirSync(projectThumbnailsDir, { recursive: true });
  }

  const sourcePath = path.join(rootDir, 'public', imagePath);
  const thumbnailFileName = `${folderName}.webp`;
  const thumbnailPath = path.join(projectThumbnailsDir, thumbnailFileName);

  if (fs.existsSync(thumbnailPath)) {
    const sourceStat = fs.statSync(sourcePath);
    const thumbnailStat = fs.statSync(thumbnailPath);
    if (thumbnailStat.mtimeMs >= sourceStat.mtimeMs) {
      return `/images/project-thumbnails/${thumbnailFileName}`;
    }
  }

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: 900,
      height: 384,
      fit: 'cover',
      position: 'attention',
      withoutEnlargement: true,
    })
    .webp({ quality: 78, effort: 4 })
    .toFile(thumbnailPath);

  return `/images/project-thumbnails/${thumbnailFileName}`;
}

async function createBackgroundThumbnail(sourcePublicPath, baseName) {
  const ext = path.extname(sourcePublicPath).toLowerCase();
  if (!RASTER_EXTENSIONS.has(ext)) {
    return sourcePublicPath;
  }

  if (!fs.existsSync(backgroundThumbnailsDir)) {
    fs.mkdirSync(backgroundThumbnailsDir, { recursive: true });
  }

  const sourcePath = path.join(rootDir, 'public', sourcePublicPath);
  const thumbnailFileName = `${baseName}.webp`;
  const thumbnailPath = path.join(backgroundThumbnailsDir, thumbnailFileName);

  if (fs.existsSync(thumbnailPath)) {
    const sourceStat = fs.statSync(sourcePath);
    const thumbnailStat = fs.statSync(thumbnailPath);
    if (thumbnailStat.mtimeMs >= sourceStat.mtimeMs) {
      return `/images/background-thumbnails/${thumbnailFileName}`;
    }
  }

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: 760,
      height: 520,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 76, effort: 4 })
    .toFile(thumbnailPath);

  return `/images/background-thumbnails/${thumbnailFileName}`;
}

export async function syncAllAssets() {
  // 1. Sync Project Galleries
  const galleries = {};
  const projectThumbnails = {};
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

        if (images.length > 0) {
          projectThumbnails[folderName] = await createProjectThumbnail(folderName, images[0]);
        }
      }
    }
  }

  // 2. Sync Organization Logos (matching seoultech, gist, samsung with ANY extension)
  const orgLogos = {};
  const backgroundThumbnails = {};
  if (fs.existsSync(orgsDir)) {
    const files = fs.readdirSync(orgsDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (VALID_EXTENSIONS.has(ext)) {
        const baseName = path.basename(file, ext).toLowerCase();
        const publicPath = `/images/organizations/${file}`;
        orgLogos[baseName] = publicPath;
        backgroundThumbnails[publicPath] = await createBackgroundThumbnail(
          publicPath,
          baseName
        );
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

  writeJsonIfChanged(projectOutputFile, galleries);
  writeJsonIfChanged(projectThumbnailOutputFile, projectThumbnails);
  writeJsonIfChanged(backgroundThumbnailOutputFile, backgroundThumbnails);
  writeJsonIfChanged(orgOutputFile, orgLogos);
  writeJsonIfChanged(profileOutputFile, { profileImage: profileImgPath });

  console.log(`[Asset Sync] Synced projects (${Object.keys(galleries).length}), project thumbnails (${Object.keys(projectThumbnails).length}), background thumbnails (${Object.keys(backgroundThumbnails).length}), organizations (${Object.keys(orgLogos).length}), profile (${profileImgPath})`);
}

if (process.argv.includes('--watch')) {
  await syncAllAssets();
  console.log('[Asset Watcher] Watching public/images/ for changes in real time...');

  let debounceTimer = null;
  const onFileChanged = (eventType, filename) => {
    const changedPath = String(filename || '');
    if (
      changedPath.includes('project-thumbnails') ||
      changedPath.includes('background-thumbnails')
    ) {
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      syncAllAssets().catch((error) => {
        console.error('[Asset Sync] Failed:', error);
      });
    }, 150);
  };

  if (fs.existsSync(imagesDir)) {
    fs.watch(imagesDir, { recursive: true }, onFileChanged);
  }
} else if (process.argv[1] === __filename) {
  await syncAllAssets();
}

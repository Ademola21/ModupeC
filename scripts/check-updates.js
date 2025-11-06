const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const BIN_DIR = path.join(process.cwd(), 'bin');
const YT_DLP_PATH = path.join(BIN_DIR, 'yt-dlp');
const FFMPEG_PATH = path.join(BIN_DIR, 'ffmpeg');
const FFPROBE_PATH = path.join(BIN_DIR, 'ffprobe');
const UPDATE_CHECK_FILE = path.join(BIN_DIR, '.last-update-check');
const METADATA_FILE = path.join(BIN_DIR, '.binary-metadata.json');

async function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading from ${url}...`);
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(destination);
        return downloadFile(response.headers.location, destination)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destination);
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded to ${destination}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(destination);
      reject(err);
    });
  });
}

function shouldCheckForUpdates() {
  if (!fs.existsSync(UPDATE_CHECK_FILE)) {
    return true;
  }
  
  const lastCheck = fs.readFileSync(UPDATE_CHECK_FILE, 'utf8');
  const lastCheckDate = new Date(lastCheck);
  const now = new Date();
  
  const daysSinceLastCheck = (now - lastCheckDate) / (1000 * 60 * 60 * 24);
  
  return daysSinceLastCheck >= 1;
}

function updateLastCheckTimestamp() {
  fs.writeFileSync(UPDATE_CHECK_FILE, new Date().toISOString(), 'utf8');
}

function getMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      return JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    }
  } catch (error) {
    console.warn('Warning: Could not read metadata file');
  }
  return {};
}

function saveMetadata(data) {
  const current = getMetadata();
  fs.writeFileSync(METADATA_FILE, JSON.stringify({ ...current, ...data }, null, 2), 'utf8');
}

async function getLatestYtDlpVersion() {
  return new Promise((resolve, reject) => {
    https.get('https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest', {
      headers: { 'User-Agent': 'Node.js' }
    }, (response) => {
      let data = '';
      
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const release = JSON.parse(data);
          resolve(release.tag_name);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function getCurrentYtDlpVersion() {
  try {
    const { stdout } = await execAsync(`${YT_DLP_PATH} --version`);
    return stdout.trim();
  } catch {
    return null;
  }
}

async function updateYtDlp() {
  console.log('\n🔄 Updating yt-dlp...');
  
  const metadata = getMetadata();
  const latestVersion = await getLatestYtDlpVersion();
  
  console.log(`Current version: ${metadata.ytdlp_version || 'not installed'}`);
  console.log(`Latest version: ${latestVersion}`);
  
  if (metadata.ytdlp_version === latestVersion) {
    console.log('✓ yt-dlp is up to date');
    return false;
  }
  
  if (fs.existsSync(YT_DLP_PATH)) {
    fs.unlinkSync(YT_DLP_PATH);
  }
  
  const platform = process.platform;
  let YT_DLP_URL;
  
  if (platform === 'linux') {
    const arch = process.arch === 'arm64' ? 'linux_aarch64' : 'linux';
    YT_DLP_URL = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_${arch}`;
  } else if (platform === 'darwin') {
    YT_DLP_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos';
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  await downloadFile(YT_DLP_URL, YT_DLP_PATH);
  await execAsync(`chmod +x ${YT_DLP_PATH}`);
  
  const { stdout } = await execAsync(`${YT_DLP_PATH} --version`);
  const version = stdout.trim();
  saveMetadata({ ytdlp_version: version, ytdlp_updated: new Date().toISOString() });
  console.log(`✓ yt-dlp updated successfully to version ${version}`);
  return true;
}

async function getLatestFfmpegBuildDate() {
  return new Promise((resolve, reject) => {
    https.get('https://api.github.com/repos/yt-dlp/FFmpeg-Builds/releases/latest', {
      headers: { 'User-Agent': 'Node.js' }
    }, (response) => {
      let data = '';
      
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const release = JSON.parse(data);
          resolve(release.published_at);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function getCurrentFfmpegReleaseDate() {
  const metadata = getMetadata();
  return metadata.ffmpeg_release_date || null;
}

async function updateFfmpeg() {
  console.log('\n🔄 Checking FFmpeg updates...');
  
  const platform = process.platform;
  
  if (platform !== 'linux') {
    console.log('⚠️  FFmpeg auto-update only supported on Linux');
    return false;
  }
  
  const currentReleaseDate = await getCurrentFfmpegReleaseDate();
  const latestReleaseDate = await getLatestFfmpegBuildDate();
  
  console.log(`Current build: ${currentReleaseDate ? new Date(currentReleaseDate).toLocaleDateString() : 'not installed'}`);
  console.log(`Latest build: ${new Date(latestReleaseDate).toLocaleDateString()}`);
  
  if (currentReleaseDate === latestReleaseDate) {
    console.log('✓ FFmpeg is up to date');
    return false;
  }
  
  [FFMPEG_PATH, FFPROBE_PATH].forEach(file => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });
  
  const arch = process.arch === 'arm64' ? 'linuxarm64' : 'linux64';
  const ffmpegUrl = `https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-${arch}-gpl.tar.xz`;
  const tarFile = path.join(BIN_DIR, 'ffmpeg.tar.xz');
  
  await downloadFile(ffmpegUrl, tarFile);
  console.log('Extracting FFmpeg...');
  
  await execAsync(`tar -xf ${tarFile} -C ${BIN_DIR} --strip-components=2 --wildcards '*/bin/ffmpeg' '*/bin/ffprobe'`);
  await execAsync(`rm ${tarFile}`);
  await execAsync(`chmod +x ${FFMPEG_PATH} ${FFPROBE_PATH}`);
  
  const { stdout } = await execAsync(`${FFMPEG_PATH} -version | head -n 1`);
  saveMetadata({ ffmpeg_release_date: latestReleaseDate, ffmpeg_updated: new Date().toISOString() });
  console.log(`✓ FFmpeg updated successfully (${stdout.trim()})`);
  return true;
}

async function main() {
  try {
    if (!fs.existsSync(BIN_DIR)) {
      console.log('⚠️  Binaries not installed. Run: npm run setup');
      return;
    }
    
    if (!shouldCheckForUpdates()) {
      console.log('✓ Already checked for updates today. Skipping...');
      return;
    }
    
    console.log('🔍 Checking for updates...\n');
    
    const ytDlpUpdated = await updateYtDlp();
    const ffmpegUpdated = await updateFfmpeg();
    
    updateLastCheckTimestamp();
    
    if (ytDlpUpdated || ffmpegUpdated) {
      console.log('\n✅ Updates completed successfully!\n');
    } else {
      console.log('\n✅ All binaries are up to date!\n');
    }
  } catch (error) {
    console.error('\n❌ Update check failed:', error.message);
    process.exit(1);
  }
}

main();

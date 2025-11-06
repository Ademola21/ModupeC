const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

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

const BIN_DIR = path.join(process.cwd(), 'bin');
const YT_DLP_PATH = path.join(BIN_DIR, 'yt-dlp');
const FFMPEG_PATH = path.join(BIN_DIR, 'ffmpeg');
const FFPROBE_PATH = path.join(BIN_DIR, 'ffprobe');
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

async function setupYtDlp() {
  console.log('\n📥 Setting up yt-dlp...');
  
  if (fs.existsSync(YT_DLP_PATH)) {
    console.log('✓ yt-dlp already exists');
    return;
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
  console.log(`✓ yt-dlp installed successfully (version: ${version})`);
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

async function setupFfmpeg() {
  console.log('\n📥 Setting up FFmpeg (yt-dlp optimized build)...');
  
  if (fs.existsSync(FFMPEG_PATH) && fs.existsSync(FFPROBE_PATH)) {
    console.log('✓ FFmpeg already exists');
    return;
  }
  
  const platform = process.platform;
  let ffmpegUrl;
  let extractCommand;
  
  if (platform === 'linux') {
    const arch = process.arch === 'arm64' ? 'linuxarm64' : 'linux64';
    ffmpegUrl = `https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-${arch}-gpl.tar.xz`;
    const tarFile = path.join(BIN_DIR, 'ffmpeg.tar.xz');
    
    await downloadFile(ffmpegUrl, tarFile);
    console.log('Extracting FFmpeg...');
    
    await execAsync(`tar -xf ${tarFile} -C ${BIN_DIR} --strip-components=2 --wildcards '*/bin/ffmpeg' '*/bin/ffprobe'`);
    await execAsync(`rm ${tarFile}`);
    await execAsync(`chmod +x ${FFMPEG_PATH} ${FFPROBE_PATH}`);
    
    const releaseDate = await getLatestFfmpegBuildDate();
    saveMetadata({ ffmpeg_release_date: releaseDate, ffmpeg_updated: new Date().toISOString() });
  } else if (platform === 'darwin') {
    console.log('⚠️  No official yt-dlp FFmpeg builds for macOS. Using system FFmpeg or installing via Homebrew...');
    try {
      await execAsync('which ffmpeg');
      console.log('✓ FFmpeg found in system PATH');
      return;
    } catch {
      console.log('Please install FFmpeg: brew install ffmpeg');
      throw new Error('FFmpeg not found');
    }
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  const { stdout } = await execAsync(`${FFMPEG_PATH} -version | head -n 1`);
  console.log(`✓ FFmpeg installed successfully (${stdout.trim()})`);
}

async function main() {
  try {
    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }
    
    await setupYtDlp();
    await setupFfmpeg();
    
    console.log('\n✅ All binaries set up successfully!\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();

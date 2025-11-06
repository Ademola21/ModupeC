
import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { getCookiesArgs, hasCookiesFile } from '@/utils/cookies';

const unlinkAsync = promisify(fs.unlink);

const YT_DLP_PATH = path.join(process.cwd(), 'bin', 'yt-dlp');
const FFMPEG_PATH = path.join(process.cwd(), 'bin', 'ffmpeg');
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, formatId, isCombined, title, requiresCookies } = req.body;

  console.log('Download request:', { url, formatId, isCombined, title, requiresCookies });

  if (!url || !formatId) {
    return res.status(400).json({ error: 'URL and format ID are required' });
  }

  const sanitizedTitle = (title || 'video').replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 100);
  const useCookies = requiresCookies === true || requiresCookies === 'true';
  
  let extension: string;
  let downloadArgs: string[];
  let needsMerging = false;
  let tempFilePath: string | null = null;

  try {
    // Get cookies args if video-info used cookies - ensures format compatibility
    const cookiesArgs = useCookies ? getCookiesArgs(true) : [];
    if (cookiesArgs.length > 0) {
      console.log('🔐 Using cookies for download to match video-info authentication');
    }

    // Check if format includes audio using the same approach as the working script
    console.log('Checking if format includes audio...');
    let hasAudio = false;
    let isAudio = false;
    
    try {
      const checkArgs = [
        ...cookiesArgs,
        '-j',
        '-f', formatId,
        url
      ];
      
      const info = execSync(`"${YT_DLP_PATH}" ${checkArgs.join(' ')}`).toString();
      const data = JSON.parse(info);
      hasAudio = data.acodec && data.acodec !== "none";
      isAudio = data.vcodec === "none" || !data.vcodec;
      
      console.log(hasAudio ? "✅ Format includes audio." : "⚠️ Video-only format. Will merge with best audio...");
    } catch (error) {
      console.error('Error checking format:', error);
      // Fallback to old detection method
      isAudio = formatId.toString().includes('251') || formatId.toString().includes('140');
      hasAudio = isCombined === true || isCombined === 'true' || isAudio;
    }
    
    // Use the same logic as the working script
    const formatToDownload = hasAudio ? formatId : `${formatId}+bestaudio`;
    
    if (isAudio) {
      // Audio-only format - can stream directly
      extension = 'webm';
      downloadArgs = [
        '--no-warnings',
        ...cookiesArgs,
        '-f', formatToDownload,
        '-o', '-',
        url
      ];
    } else if (hasAudio) {
      // Combined video+audio - needs FFmpeg remuxing to ensure proper MP4 (fixes MPEG-TS issue)
      needsMerging = true;
      extension = 'mp4';
      tempFilePath = path.join(DOWNLOADS_DIR, `${Date.now()}_${sanitizedTitle}.mp4`);
      
      downloadArgs = [
        '--no-warnings',
        '--ffmpeg-location', FFMPEG_PATH,
        ...cookiesArgs,
        '-f', formatToDownload,
        '--remux-video', 'mp4',
        '--postprocessor-args', 'ffmpeg:-c:v copy -c:a copy -movflags +faststart',
        '-o', tempFilePath,
        url
      ];
    } else {
      // Video-only format - needs merging with FFmpeg (like the working script does)
      needsMerging = true;
      extension = 'mp4';
      tempFilePath = path.join(DOWNLOADS_DIR, `${Date.now()}_${sanitizedTitle}.mp4`);
      
      downloadArgs = [
        '--no-warnings',
        '--ffmpeg-location', FFMPEG_PATH,
        ...cookiesArgs,
        '-f', formatToDownload,
        '--merge-output-format', 'mp4',
        '--postprocessor-args', 'ffmpeg:-c:v copy -c:a copy -movflags +faststart',
        '--no-part',
        '--concurrent-fragments', '4',
        '-o', tempFilePath,
        url
      ];
    }

    const filename = `${sanitizedTitle}.${extension}`;
    const contentType = isAudio ? 'audio/webm' : 'video/mp4';

    if (needsMerging && tempFilePath) {
      // Download to temp file first, then stream it
      await new Promise<void>((resolve, reject) => {
        const proc = spawn(YT_DLP_PATH, downloadArgs);

        proc.stderr.on('data', (data) => {
          console.error('yt-dlp stderr:', data.toString());
        });

        proc.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error('Download failed'));
          }
        });

        proc.on('error', reject);

        req.on('close', () => {
          proc.kill();
          reject(new Error('Request closed'));
        });
      });

      // Now stream the temp file to response
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      const fileStream = fs.createReadStream(tempFilePath);
      
      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream file' });
        }
      });

      fileStream.pipe(res);

      // Track if cleanup has been done
      let cleanupDone = false;
      
      const cleanup = async (reason: string) => {
        if (cleanupDone) {
          console.log(`Cleanup already done, skipping (${reason})`);
          return;
        }
        cleanupDone = true;
        
        console.log(`Starting cleanup (${reason}) for:`, tempFilePath);
        
        try {
          fileStream.destroy();
          
          // Small delay to ensure file handle is released
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            await unlinkAsync(tempFilePath);
            console.log(`✓ Successfully deleted merged file (${reason}):`, path.basename(tempFilePath));
          } else {
            console.log(`Merged file already deleted (${reason})`);
          }
        } catch (err) {
          console.error(`✗ Failed to delete temp file (${reason}):`, err);
        }
      };

      // Delete on successful completion
      res.on('finish', () => {
        console.log('Response finished, triggering cleanup for merged file');
        cleanup('download complete');
      });
      
      // Delete if browser cancels download or connection closes
      req.on('close', () => {
        console.log('Request closed, triggering cleanup for merged file');
        cleanup('request closed/cancelled');
      });
      
      // Delete on stream error
      fileStream.on('error', (err) => {
        console.log('Stream error, triggering cleanup for merged file:', err.message);
        cleanup('stream error');
      });

    } else {
      // Stream directly for audio and combined formats
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Transfer-Encoding', 'chunked');

      const proc = spawn(YT_DLP_PATH, downloadArgs);

      proc.stdout.on('data', (chunk) => {
        res.write(chunk);
      });

      proc.stderr.on('data', (data) => {
        console.error('yt-dlp stderr:', data.toString());
      });

      proc.on('close', (code) => {
        if (code === 0) {
          res.end();
        } else {
          if (!res.headersSent) {
            res.status(500).json({ error: 'Download failed' });
          } else {
            res.end();
          }
        }
      });

      proc.on('error', (error) => {
        console.error('Process error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: error.message });
        } else {
          res.end();
        }
      });

      req.on('close', () => {
        proc.kill();
      });
    }

  } catch (error: any) {
    console.error('Error streaming video:', error);
    
    // Clean up temp file on error
    if (tempFilePath) {
      try {
        if (fs.existsSync(tempFilePath)) {
          await unlinkAsync(tempFilePath);
        }
      } catch (err) {
        console.error('Failed to delete temp file on error:', err);
      }
    }
    
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream video', details: error.message });
    }
  }
}

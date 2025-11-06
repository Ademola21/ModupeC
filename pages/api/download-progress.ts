import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { getCookiesArgs } from '@/utils/cookies';

const YT_DLP_PATH = path.join(process.cwd(), 'bin', 'yt-dlp');
const FFMPEG_PATH = path.join(process.cwd(), 'bin', 'ffmpeg');
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Disable body parsing and response timeout for streaming
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, formatId, isCombined, title, sizeBytes, requiresCookies } = req.query;

  if (!url || !formatId || typeof url !== 'string' || typeof formatId !== 'string') {
    return res.status(400).json({ error: 'URL and format ID are required' });
  }

  const sanitizedTitle = ((title as string) || 'video').replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 100);
  const useCookies = requiresCookies === 'true';

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
    isAudio = formatId.includes('251') || formatId.includes('140');
    hasAudio = isCombined === 'true' || isAudio;
  }

  // Use the same logic as the working script
  const formatToDownload = hasAudio ? formatId : `${formatId}+bestaudio`;
  
  let extension: string;
  let downloadArgs: string[];
  const downloadId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const tempFilePath = path.join(DOWNLOADS_DIR, `${downloadId}_${sanitizedTitle}.${isAudio ? 'webm' : 'mp4'}`);

  try {
    if (isAudio) {
      extension = 'webm';
      downloadArgs = [
        '--no-warnings',
        '--newline',
        '--progress',
        ...cookiesArgs,
        '-f', formatToDownload,
        '-o', tempFilePath,
        url
      ];
    } else if (hasAudio) {
      // Combined video+audio format - use FFmpeg to ensure proper MP4 format
      // Fixes MPEG-TS issue with m3u8/HLS formats
      extension = 'mp4';
      downloadArgs = [
        '--no-warnings',
        '--newline',
        '--progress',
        '--ffmpeg-location', FFMPEG_PATH,
        ...cookiesArgs,
        '-f', formatToDownload,
        '--remux-video', 'mp4',
        '--postprocessor-args', 'ffmpeg:-c:v copy -c:a copy -movflags +faststart',
        '-o', tempFilePath,
        url
      ];
    } else {
      // Video-only format - merge with audio and ensure proper MP4
      extension = 'mp4';
      downloadArgs = [
        '--no-warnings',
        '--newline',
        '--progress',
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

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      // Force flush to prevent buffering
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    };

    sendEvent('start', { downloadId, message: 'Download started' });
    sendEvent('progress', { progress: 0 });

    const proc = spawn(YT_DLP_PATH, downloadArgs);
    let firstFileSize = 0;
    let secondFileSize = 0;
    let currentFileProgress = 0;
    let firstFileComplete = false;
    let lastSentProgress = 0;
    let accumulatedMB = 0;
    let isMerging = false;

    // Helper function to parse progress from output
    const parseProgress = (output: string) => {
      // Parse yt-dlp progress output
      // Format: [download]  45.5% of ~50.00MiB at  2.50MiB/s ETA 00:10
      const progressMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
      const sizeMatch = output.match(/of\s+(~)?(\d+\.?\d*)(MiB|KiB|GiB)/i);
      const speedMatch = output.match(/at\s+(\d+\.?\d*)(MiB|KiB|GiB)\/s/i);
      const etaMatch = output.match(/ETA\s+(\d+:\d+)/);

      if (progressMatch && sizeMatch) {
        const progress = parseFloat(progressMatch[1]);
        const unit = sizeMatch[3].toLowerCase();
        const sizeValue = parseFloat(sizeMatch[2]);

        // Convert to MB
        let sizeMB: number;
        if (unit === 'gib') {
          sizeMB = sizeValue * 1024;
        } else if (unit === 'kib') {
          sizeMB = sizeValue / 1024;
        } else { // MiB
          sizeMB = sizeValue;
        }

        // Detect when we switch to second file
        if (firstFileSize === 0) {
          // This is the first file
          firstFileSize = sizeMB;
          console.log(`First file detected: ${sizeMB.toFixed(2)} MB`);
        } else if (!firstFileComplete && Math.abs(sizeMB - firstFileSize) > 0.1) {
          // Size changed significantly - we moved to the second file
          firstFileComplete = true;
          secondFileSize = sizeMB;
          accumulatedMB = firstFileSize;
          console.log(`Second file detected: ${sizeMB.toFixed(2)} MB, accumulated: ${accumulatedMB.toFixed(2)} MB`);
        }

        currentFileProgress = progress;

        // Calculate total progress
        let totalSize: number;
        let totalDownloaded: number;

        if (firstFileComplete) {
          // We're on the second file
          totalSize = firstFileSize + secondFileSize;
          totalDownloaded = accumulatedMB + (secondFileSize * currentFileProgress) / 100;
        } else {
          // Still on first file (might be audio-only or combined format)
          totalSize = firstFileSize;
          totalDownloaded = (firstFileSize * currentFileProgress) / 100;
        }

        const combinedProgress = totalSize > 0 ? (totalDownloaded / totalSize) * 100 : 0;

        // Send update for every 1% change
        const roundedProgress = Math.floor(combinedProgress);
        if (roundedProgress > Math.floor(lastSentProgress)) {
          lastSentProgress = combinedProgress;

          console.log(`Sending progress: ${roundedProgress}%`);

          sendEvent('progress', {
            progress: roundedProgress
          });
        }
      }
    };

    // yt-dlp writes progress to BOTH stdout and stderr
    // Listen to both streams to catch all progress updates
    proc.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('yt-dlp stdout:', output);

      // Detect merging stage
      if (output.includes('[Merger]') || output.includes('Merging formats')) {
        if (!isMerging) {
          isMerging = true;
          sendEvent('merging', { message: 'Merging video and audio... This may take a while for large files.' });

          // Send periodic updates during merge
          const mergeUpdateInterval = setInterval(() => {
            sendEvent('merging', { message: 'Still merging... Please wait.' });
          }, 10000);

          // Clear interval when process closes
          proc.once('close', () => clearInterval(mergeUpdateInterval));
        }
      }

      parseProgress(output);
    });

    proc.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('yt-dlp stderr:', output);

      // Detect errors
      if (output.includes('ERROR:') || output.includes('Conversion failed')) {
        console.error('yt-dlp error detected:', output);
        sendEvent('error', { message: 'Download failed during processing. File may be too large for available resources.' });
      }

      // Detect merging stage
      if (output.includes('[Merger]') || output.includes('Merging formats')) {
        if (!isMerging) {
          isMerging = true;
          sendEvent('merging', { message: 'Merging video and audio... This may take a while for large files.' });

          // Send periodic updates during merge
          const mergeUpdateInterval = setInterval(() => {
            sendEvent('merging', { message: 'Still merging... Please wait.' });
          }, 10000);

          // Clear interval when process closes
          proc.once('close', () => clearInterval(mergeUpdateInterval));
        }
      }

      parseProgress(output);
    });

    let downloadSuccess = false;

    proc.on('close', async (code) => {
      if (code === 0) {
        // Wait for the merged file to be fully written
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        while (!fs.existsSync(tempFilePath) && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (fs.existsSync(tempFilePath)) {
          console.log('File exists, sending complete event:', tempFilePath);
          downloadSuccess = true;
          const filename = `${sanitizedTitle}.${extension}`;
          sendEvent('complete', {
            downloadId,
            filename,
            filePath: tempFilePath,
            message: 'Download complete! Starting browser download...'
          });
        } else {
          console.error('File not found after waiting:', tempFilePath);
          sendEvent('error', { message: 'Download completed but file not found. This may be due to insufficient storage space.' });
        }
      } else {
        console.error('Process exited with code:', code);
        const errorMsg = code === 1 
          ? 'Download failed during merge. The file may be too large or storage is insufficient.' 
          : 'Download failed with error code: ' + code;
        sendEvent('error', { message: errorMsg });
        // Clean up temp file on failure
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
      res.end();
    });

    proc.on('error', (error) => {
      console.error('Process error:', error);
      sendEvent('error', { message: error.message });
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      res.end();
    });

    req.on('close', () => {
      proc.kill();
      // Only clean up if download was NOT successful
      // On success, let download-file endpoint handle cleanup
      if (!downloadSuccess && fs.existsSync(tempFilePath)) {
        console.log('Cleaning up temp file after connection close:', tempFilePath);
        fs.unlinkSync(tempFilePath);
      }
    });

  } catch (error: any) {
    console.error('Error in download-progress:', error);
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ message: error.message })}\n\n`);
    res.end();
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filePath, filename } = req.query;

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'File path is required' });
  }

  console.log('Attempting to download file:', filePath);

  // Security: Ensure the file is in the downloads directory
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(DOWNLOADS_DIR)) {
    console.error('Invalid file path - not in downloads directory:', normalizedPath);
    return res.status(403).json({ error: 'Invalid file path' });
  }

  // List files in downloads directory for debugging
  const filesInDir = fs.readdirSync(DOWNLOADS_DIR);
  console.log('Files in downloads directory:', filesInDir);

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    console.error('Looking for file:', path.basename(filePath));
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const stats = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    const contentType = filePath.endsWith('.webm') ? 'audio/webm' : 'video/mp4';
    const downloadFilename = filename || path.basename(filePath);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);

    // Track if cleanup has been done
    let cleanupDone = false;
    let streamEnded = false;
    
    const cleanup = async (reason: string) => {
      if (cleanupDone) {
        return;
      }
      cleanupDone = true;
      
      console.log(`[CLEANUP] Starting cleanup (${reason}) for:`, path.basename(filePath));
      
      try {
        // Destroy the stream first
        if (!fileStream.destroyed) {
          fileStream.destroy();
        }
        
        // Wait for file handle to be released
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (fs.existsSync(filePath)) {
          await unlinkAsync(filePath);
          console.log(`[CLEANUP] ✓ Successfully deleted temp file (${reason}):`, path.basename(filePath));
        } else {
          console.log(`[CLEANUP] File already deleted (${reason})`);
        }
      } catch (err) {
        console.error(`[CLEANUP] ✗ Failed to delete temp file (${reason}):`, err);
        // Retry after a delay
        setTimeout(async () => {
          try {
            if (fs.existsSync(filePath)) {
              await unlinkAsync(filePath);
              console.log(`[CLEANUP] ✓ Successfully deleted on retry (${reason}):`, path.basename(filePath));
            }
          } catch (retryErr) {
            console.error(`[CLEANUP] ✗ Retry failed (${reason}):`, retryErr);
          }
        }, 3000);
      }
    };

    // Handle file stream errors
    fileStream.on('error', (error) => {
      console.error('[STREAM] File stream error:', error);
      cleanup('stream error');
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream file' });
      }
    });

    // Track stream completion
    fileStream.on('end', () => {
      console.log('[STREAM] Stream ended');
      streamEnded = true;
    });

    fileStream.on('close', () => {
      console.log('[STREAM] Stream closed, streamEnded:', streamEnded);
      if (streamEnded) {
        // Stream completed normally, schedule cleanup
        setTimeout(() => cleanup('stream complete'), 2000);
      }
    });

    // Pipe the file to response
    fileStream.pipe(res);

    // Handle response completion
    res.on('finish', () => {
      console.log('[RESPONSE] Response finished');
      setTimeout(() => cleanup('response finished'), 2000);
    });

    res.on('close', () => {
      console.log('[RESPONSE] Response closed, streamEnded:', streamEnded);
      if (!streamEnded) {
        // Connection closed before stream finished (cancelled)
        cleanup('response closed early');
      } else {
        // Normal completion
        setTimeout(() => cleanup('response closed after completion'), 2000);
      }
    });
    
    // Handle request cancellation
    req.on('close', () => {
      console.log('[REQUEST] Request closed, streamEnded:', streamEnded);
      if (!streamEnded) {
        cleanup('request cancelled');
      }
    });

  } catch (error: any) {
    console.error('Error serving file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to serve file', details: error.message });
    }
  }
}

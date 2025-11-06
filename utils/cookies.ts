import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

/**
 * Checks for YouTube cookies file and returns the path if it exists.
 * Looks for both 'youtube-cookies.txt' and 'cookies.txt' in the project root.
 * @returns The absolute path to the cookies file if found, otherwise null
 */
export function getCookiesFilePath(): string | null {
  const possiblePaths = [
    path.join(process.cwd(), 'youtube-cookies.txt'),
    path.join(process.cwd(), 'cookies.txt'),
  ];

  for (const cookiePath of possiblePaths) {
    if (fs.existsSync(cookiePath)) {
      console.log(`✓ Found YouTube cookies file: ${path.basename(cookiePath)}`);
      return cookiePath;
    }
  }

  return null;
}

/**
 * Returns yt-dlp command arguments for cookies if a cookies file exists.
 * By default, returns empty array unless forceUseCookies is true.
 * This prevents format mismatch issues where cookies change available formats.
 * 
 * @param forceUseCookies - Set to true to force cookie usage (for auth-required videos)
 * @returns Array of arguments to add to yt-dlp command, or empty array if no cookies file
 */
export function getCookiesArgs(forceUseCookies: boolean = false): string[] {
  if (!forceUseCookies) {
    return [];
  }
  
  const cookiesPath = getCookiesFilePath();
  if (cookiesPath) {
    console.log(`🔐 Using YouTube cookies for authenticated access`);
    return ['--cookies', cookiesPath];
  }
  return [];
}

/**
 * Check if cookies file exists
 */
export function hasCookiesFile(): boolean {
  return getCookiesFilePath() !== null;
}

/**
 * Result from executing a command with potential cookie retry
 */
export interface ExecuteResult {
  output: string;
  usedCookies: boolean;
}

/**
 * Execute a command and return the output
 */
function executeCommand(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed: ${stderr}`));
      }
    });

    proc.on('error', reject);
  });
}

/**
 * Execute a yt-dlp command with automatic cookie usage.
 * If a cookies file exists, it will ALWAYS be used to ensure consistency
 * between format detection and downloading. This prevents format mismatch issues.
 * 
 * Strategy:
 * 1. If cookies file exists, use it from the start (preferred)
 * 2. If no cookies file, run without cookies
 * 3. If command fails, retry with cookies as fallback (for edge cases)
 * 
 * @param command - The command to execute (typically path to yt-dlp)
 * @param args - Command arguments (URL should be last)
 * @returns Object containing output and usedCookies flag
 */
export async function executeWithCookieRetry(
  command: string,
  args: string[]
): Promise<ExecuteResult> {
  const cookiesExist = hasCookiesFile();
  
  // If cookies exist, use them from the start to ensure format consistency
  if (cookiesExist) {
    try {
      console.log('🔐 Using cookies file for authenticated access (ensures format consistency)');
      const cookiesArgs = getCookiesArgs(true);
      // Insert cookies args before the last argument (URL)
      const argsWithCookies = [...args.slice(0, -1), ...cookiesArgs, args[args.length - 1]];
      const output = await executeCommand(command, argsWithCookies);
      return { output, usedCookies: true };
    } catch (error: any) {
      console.log('⚠️ Command failed with cookies, trying without cookies as fallback...');
      // Fallback: try without cookies in case cookies are causing issues
      try {
        const output = await executeCommand(command, args);
        return { output, usedCookies: false };
      } catch (fallbackError: any) {
        // Both attempts failed, throw the original error
        throw error;
      }
    }
  }
  
  // No cookies file exists, run without cookies
  try {
    const output = await executeCommand(command, args);
    return { output, usedCookies: false };
  } catch (error: any) {
    const errorMsg = error.message || '';
    
    // Check if error is due to bot detection / sign-in requirement
    const needsAuth = errorMsg.includes('Sign in') || 
                      errorMsg.includes('bot') || 
                      errorMsg.includes('not available');
    
    // This shouldn't happen since we checked hasCookiesFile() above,
    // but keep this as a safety net
    if (needsAuth && hasCookiesFile()) {
      console.log('⚠️ Access blocked, retrying with cookies...');
      const cookiesArgs = getCookiesArgs(true);
      const argsWithCookies = [...args.slice(0, -1), ...cookiesArgs, args[args.length - 1]];
      const output = await executeCommand(command, argsWithCookies);
      return { output, usedCookies: true };
    }
    
    throw error;
  }
}

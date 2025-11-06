import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { LinkIcon } from '@/components/icons/LinkIcon';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { VideoCameraIcon } from '@/components/icons/VideoCameraIcon';
import { MusicNoteIcon } from '@/components/icons/MusicNoteIcon';
import { DownloaderInitialState } from '@/components/DownloaderInitialState';
import { useToast } from '@/components/ToastNotifications';

type DownloadStatus = 'idle' | 'analyzing' | 'results' | 'downloading' | 'error';
type FormatType = 'Video' | 'Audio';
type Format = {
  id: string;
  quality: string;
  qualityLabel: string;
  type: FormatType;
  size: string;
  sizeBytes?: number;
  isCombined?: boolean;
};

type VideoData = {
  title: string;
  author: string;
  thumbnail: string;
  requiresCookies: boolean;
  formats: {
    video: Format[];
    audio: Format[];
  };
};

const QualityTag: React.FC<{ quality: string }> = ({ quality }) => {
    const qualityMap: {[key: string]: string} = {
        '4K': 'bg-purple-600',
        'HD': 'bg-blue-500',
        'SD': 'bg-gray-500',
        '320k': 'bg-green-500',
        '128k': 'bg-teal-500'
    };
    return (
        <span className={`px-2.5 py-1 text-xs font-bold text-white rounded-full ${qualityMap[quality] || 'bg-gray-600'}`}>
            {quality}
        </span>
    );
};

interface FormatCardProps {
    format: Format;
    onDownload: () => void;
    isDownloading: boolean;
    activeDownloadId: string | null;
    progress: number;
    downloadedSize: string;
    totalSize: string;
    speed: string;
    eta: string;
    stage: 'server' | 'browser' | 'merging';
}

const FormatCard: React.FC<FormatCardProps> = React.memo(({ format, onDownload, isDownloading, activeDownloadId, progress, speed = '', eta = '', stage }) => {
    const isThisDownloading = isDownloading && activeDownloadId === format.id;
    const isDisabled = isDownloading && activeDownloadId !== format.id;

    return (
        <div className={`bg-background-secondary rounded-lg overflow-hidden transition-all duration-300 ${isDisabled ? 'opacity-50' : 'opacity-100 hover:bg-background-tertiary/60'}`}>
            <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {format.type === 'Video' ? <VideoCameraIcon className="w-6 h-6 text-text-muted flex-shrink-0" /> : <MusicNoteIcon className="w-6 h-6 text-text-muted flex-shrink-0" />}
                    <div>
                        <p className="font-bold text-text-primary">{format.qualityLabel}</p>
                        <p className="text-sm text-text-muted">Approx. {format.size}</p>
                    </div>
                </div>
                <QualityTag quality={format.quality} />
            </div>

            <div className="bg-background-tertiary/50 px-5 py-3 min-h-[60px] flex items-center justify-center">
                {isThisDownloading ? (
                    <div className="w-full text-center animate-fade-in">
                        <p className="text-sm font-semibold text-text-primary">
                            {stage === 'server'
                                ? (progress === 0 ? 'Preparing download...' : 'Uploading from server')
                                : stage === 'merging' ? 'Merging files...' : 'Browser download started'}
                        </p>
                        <p className="text-xs text-text-muted font-mono tracking-tighter">
                            {progress > 0 ? `${Math.round(progress)}%` : ''}
                        </p>
                        {stage === 'server' && speed && progress > 0 && (
                            <p className="text-xs text-text-muted mt-1">
                                Speed: {speed}{eta && ` • ETA: ${eta}`}
                            </p>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={onDownload}
                        disabled={isDisabled}
                        className="w-full flex items-center justify-center bg-white/10 text-text-secondary font-semibold py-2.5 px-4 rounded-full hover:bg-white/20 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Download
                    </button>
                )}
            </div>
        </div>
    );
});


const DownloaderPage: React.FC = () => {
    const router = useRouter();
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<DownloadStatus>('idle');
    const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
    const [isThumbLoaded, setIsThumbLoaded] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadedSize, setDownloadedSize] = useState('');
    const [totalSize, setTotalSize] = useState('');
    const [downloadSpeed, setDownloadSpeed] = useState('');
    const [downloadEta, setDownloadEta] = useState('');
    const [downloadStage, setDownloadStage] = useState<'server' | 'browser' | 'merging'>('server');
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { addToast } = useToast();

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!url.trim() || status === 'analyzing') return;

        setStatus('analyzing');
        setActiveDownloadId(null);
        setIsThumbLoaded(false);
        setErrorMessage('');

        try {
            const response = await fetch('/api/video-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch video information');
            }

            const data = await response.json();
            setVideoData(data);
            setStatus('results');
        } catch (error: any) {
            console.error('Error fetching video info:', error);
            setErrorMessage(error.message || 'Failed to fetch video information. Please check the URL and try again.');
            setStatus('error');
            addToast('Failed to fetch video information', 'error');
        }
    };

    const handleDownload = async (format: Format) => {
        if (activeDownloadId) return;

        setActiveDownloadId(format.id);
        setStatus('downloading');
        setDownloadProgress(0);
        setDownloadedSize('');
        setTotalSize('');
        setDownloadSpeed('');
        setDownloadEta('');
        setDownloadStage('server');

        // Check if this is a combined format or audio (can stream directly)
        const isAudio = format.id.includes('251') || format.id.includes('140');
        const canStreamDirectly = format.isCombined || isAudio;

        try {
            if (canStreamDirectly) {
                // Direct streaming - no server storage, instant download
                setDownloadStage('browser');
                setDownloadProgress(100);

                const response = await fetch('/api/stream-download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: url,
                        formatId: format.id,
                        isCombined: format.isCombined || false,
                        title: videoData?.title || 'video',
                        requiresCookies: videoData?.requiresCookies || false
                    })
                });

                if (!response.ok) {
                    throw new Error('Stream download failed');
                }

                // Trigger browser download from stream
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const extension = isAudio ? 'webm' : 'mp4';
                const filename = `${videoData?.title || 'video'}.${extension}`.replace(/[^\w\s.-]/g, '').replace(/\s+/g, '_');

                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = filename;
                link.click();

                window.URL.revokeObjectURL(downloadUrl);

                addToast('Download started!', 'success');
                setActiveDownloadId(null);
                setStatus('results');
                return;
            }

            // For video-only formats that need merging, use SSE progress tracking
            const eventSource = new EventSource(
                `/api/download-progress?${new URLSearchParams({
                    url: url,
                    formatId: format.id,
                    isCombined: String(format.isCombined || false),
                    title: videoData?.title || 'video',
                    sizeBytes: String(format.sizeBytes || 0),
                    requiresCookies: String(videoData?.requiresCookies || false)
                })}`
            );

            let downloadFilePath: string = '';
            let downloadFilename: string = '';

            eventSource.addEventListener('start', (e) => {
                const data = JSON.parse(e.data);
                console.log('Download started:', data);
            });

            eventSource.addEventListener('progress', (e) => {
                const data = JSON.parse(e.data);
                console.log('Progress update received:', data.progress);
                setDownloadProgress(data.progress || 0);
                setDownloadedSize(data.downloaded || '');
                setTotalSize(data.total || '');
                setDownloadSpeed(data.speed || '');
                setDownloadEta(data.eta || '');
                setDownloadStage('server');
            });

            eventSource.addEventListener('merging', (e) => {
                setDownloadStage('merging');
                setDownloadProgress(100);
            });

            eventSource.addEventListener('complete', (e) => {
                const data = JSON.parse(e.data);
                downloadFilePath = data.filePath;
                downloadFilename = data.filename;

                // Keep the progress at 100% and switch to browser stage
                setDownloadStage('browser');
                setDownloadProgress(100);
                addToast('Server download complete! Starting browser download...', 'success');

                // Close SSE connection
                eventSource.close();

                // Trigger browser download
                const downloadUrl = `/api/download-file?${new URLSearchParams({
                    filePath: downloadFilePath,
                    filename: downloadFilename
                })}`;

                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = downloadFilename;
                link.click();

                // Reset UI after a short delay
                setTimeout(() => {
                    setActiveDownloadId(null);
                    setStatus('results');
                    setDownloadProgress(0);
                    setDownloadedSize('');
                    setTotalSize('');
                    setDownloadSpeed('');
                    setDownloadEta('');
                    setDownloadStage('server');
                }, 3000);
            });

            eventSource.addEventListener('error', (e: any) => {
                const data = e.data ? JSON.parse(e.data) : { message: 'Download failed' };
                console.error('Download error:', data);
                addToast(data.message || 'Download failed', 'error');
                eventSource.close();
                setActiveDownloadId(null);
                setStatus('results');
            });

            eventSource.onerror = (error) => {
                console.error('SSE connection error:', error);

                // Check if we're at 100% and merging - this is normal
                if (downloadStage === 'merging' && downloadProgress === 100) {
                    console.log('Connection closed during merge - this is expected for large files');
                    return;
                }

                addToast('Connection error during download. Please try again.', 'error');
                eventSource.close();
                setActiveDownloadId(null);
                setStatus('results');
            };

        } catch (error: any) {
            console.error('Download error:', error);
            addToast(error.message || 'Download failed', 'error');
            setActiveDownloadId(null);
            setStatus('results');
        }
    }

    const videoFormats = videoData?.formats.video || [];
    const audioFormats = videoData?.formats.audio || [];

  return (
    <div className="animate-fade-in pt-20 md:pt-24 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center text-gray-800 dark:text-text-secondary hover:black dark:hover:text-white font-semibold transition-colors duration-300 group mb-8">
                    <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-text-primary">Unlock Your Media</h1>
                    <p className="text-lg text-gray-500 dark:text-text-muted mt-2">Effortlessly download videos and audio from YouTube. Just paste a link below to begin.</p>
                </div>

                <form onSubmit={handleFetch} className="mb-12">
                    <div className="relative group">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-text-muted transition-colors duration-300 group-focus-within:text-black dark:group-focus-within:text-white" />
                        <input
                          type="url"
                          placeholder="Paste your YouTube URL here..."
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          disabled={status === 'analyzing'}
                          className={`w-full bg-gray-100 dark:bg-background-secondary border-2 border-transparent rounded-full py-4 pl-12 pr-32 sm:pr-40 text-black dark:text-white placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all duration-300 text-base ${status === 'analyzing' ? 'animate-pulse' : ''}`}
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 dark:bg-white text-white dark:text-black font-bold py-2.5 px-6 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 disabled:opacity-70 disabled:scale-100 disabled:cursor-wait w-28 sm:w-36 text-center"
                            disabled={status === 'analyzing' || !url.trim()}
                        >
                            {status === 'analyzing' ? (
                               <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                               </div>
                            ) : 'Fetch'}
                        </button>
                    </div>
                </form>

                {status === 'idle' && <DownloaderInitialState />}

                {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                        <p className="text-red-500 font-semibold mb-2">Error</p>
                        <p className="text-text-muted">{errorMessage}</p>
                    </div>
                )}

                <div className={`transition-all duration-700 ease-in-out ${status !== 'idle' && status !== 'error' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 invisible h-0'}`}>
                    {(status === 'results' || status === 'downloading') && videoData && (
                        <div className="bg-background-secondary/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                            <div className="space-y-10">
                                <div className="bg-background-secondary rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-lg">
                                    <div className="relative w-full sm:w-48 h-auto aspect-video sm:aspect-square flex-shrink-0 bg-background-tertiary">
                                        <img
                                            src={videoData.thumbnail}
                                            alt={videoData.title}
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${isThumbLoaded ? 'opacity-100' : 'opacity-0'}`}
                                            loading="eager"
                                            onLoad={() => setIsThumbLoaded(true)}
                                        />
                                </div>
                                    <div className="p-5 flex flex-col justify-center">
                                        <h2 className="text-xl font-bold text-text-primary line-clamp-2">{videoData.title}</h2>
                                        <p className="text-text-muted mt-1">by {videoData.author}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-4">Video Formats</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {videoFormats.map(format => (
                                            <FormatCard
                                                key={format.id}
                                                format={format}
                                                onDownload={() => handleDownload(format)}
                                                isDownloading={status === 'downloading'}
                                                activeDownloadId={activeDownloadId}
                                                progress={activeDownloadId === format.id ? downloadProgress : 0}
                                                downloadedSize={activeDownloadId === format.id ? downloadedSize : ''}
                                                totalSize={activeDownloadId === format.id ? totalSize : ''}
                                                speed={activeDownloadId === format.id ? downloadSpeed : ''}
                                                eta={activeDownloadId === format.id ? downloadEta : ''}
                                                stage={activeDownloadId === format.id ? downloadStage : 'server'}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-4">Audio Formats</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {audioFormats.map(format => (
                                            <FormatCard
                                                key={format.id}
                                                format={format}
                                                onDownload={() => handleDownload(format)}
                                                isDownloading={status === 'downloading'}
                                                activeDownloadId={activeDownloadId}
                                                progress={activeDownloadId === format.id ? downloadProgress : 0}
                                                downloadedSize={activeDownloadId === format.id ? downloadedSize : ''}
                                                totalSize={activeDownloadId === format.id ? totalSize : ''}
                                                speed={activeDownloadId === format.id ? downloadSpeed : ''}
                                                eta={activeDownloadId === format.id ? downloadEta : ''}
                                                stage={activeDownloadId === format.id ? downloadStage : 'server'}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DownloaderPage;
import React from 'react';
import { PasteIcon } from './icons/PasteIcon';
import { FormatIcon } from './icons/FormatIcon';
import { DownloadSimpleIcon } from './icons/DownloadSimpleIcon';

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-background-tertiary rounded-full text-text-secondary">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-text-primary">{title}</h3>
            <p className="text-text-muted">{description}</p>
        </div>
    </div>
);

const DownloaderInitialStateComponent: React.FC = () => {
    return (
        <div className="bg-background-secondary p-8 rounded-lg animate-fade-in space-y-8">
            <Step 
                icon={<PasteIcon className="w-6 h-6" />}
                title="1. Paste Link"
                description="Find the video you want on YouTube and copy its URL. Paste it into the search bar above."
            />
            <Step 
                icon={<FormatIcon className="w-6 h-6" />}
                title="2. Choose Format"
                description="We'll analyze the link and show you all available video and audio formats, from high-quality 4K to audio-only MP3s."
            />
            <Step 
                icon={<DownloadSimpleIcon className="w-6 h-6" />}
                title="3. Download"
                description="Select your desired format and click the download button. The file will be saved directly to your device."
            />
        </div>
    );
};

export const DownloaderInitialState = React.memo(DownloaderInitialStateComponent);
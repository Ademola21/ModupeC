import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';

const HowToDownloadPage: React.FC = () => {
  return (
    <StaticPageLayout title="How to Download">
        <p className="text-lg mb-8">
            Downloading your favorite movies from CeniMax is designed to be a simple and straightforward process. Follow these steps to get started.
        </p>

        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-3">Step 1: Find a Movie You Love</h2>
                <p>
                    Browse our extensive library using the homepage sections like "New Releases" and "Trending," or use the search bar to find something specific. You can also filter by genre to discover new titles.
                </p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-3">Step 2: Go to the Movie Details Page</h2>
                <p>
                    Once you've found a movie, click on its poster. This will take you to the movie's dedicated details page where you can find the synopsis, cast, and more.
                </p>
            </div>
             <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-3">Step 3: Initiate the Download</h2>
                <p>
                    On the movie details page, you'll see a prominent "Download Now" button. Clicking this will take you to our secure Downloader Page, with the movie's information ready to go.
                </p>
            </div>
             <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-3">Step 4: Select Your Format</h2>
                <p>
                    The Downloader Page will present you with a list of available formats and quality options (e.g., 1080p Full HD, 720p HD). Choose the one that best suits your needs and device.
                </p>
            </div>
             <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-3">Step 5: Start Downloading</h2>
                <p>
                    Click the "Download" button next to your chosen format. A simulated progress bar will appear to show that your request is being processed. The download will automatically start in your browser and the file will be saved to your device's default download location.
                </p>
            </div>
        </div>
    </StaticPageLayout>
  );
};

export default HowToDownloadPage;
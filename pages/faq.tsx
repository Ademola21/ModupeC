import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { AccordionItem } from '@/components/AccordionItem';

const FAQPage: React.FC = () => {
  return (
    <StaticPageLayout title="Frequently Asked Questions">
        <p className="mb-8">
           Find quick answers to common questions about CeniMax. If you don't find your answer here, please visit our Help Center or contact us directly.
        </p>

        <div className="space-y-2">
            <AccordionItem title="Is CeniMax a free service?">
                <p>Yes, CeniMax is a platform designed to demonstrate a high-quality user interface for browsing and discovering movies. The download functionality is simulated and for demonstration purposes only. There are no charges or fees associated with using this site.</p>
            </AccordionItem>
            <AccordionItem title="What formats are available for download?">
                <p>We provide a variety of common formats to suit your needs, including high-definition video options (like 1080p and 720p) and audio-only formats. The available options and approximate file sizes are displayed on the downloader page for each movie.</p>
            </AccordionItem>
            <AccordionItem title="Is this a streaming service?">
                <p>No, CeniMax is not a streaming service. Our core functionality is focused on providing a user-friendly interface for downloading movie files to your personal device for offline viewing.</p>
            </AccordionItem>
            <AccordionItem title="Can I download on multiple devices?">
                <p>Since downloads are saved directly to your device, you can use CeniMax to download files on any device with a web browser and sufficient storage space, including desktops, laptops, and tablets.</p>
            </AccordionItem>
            <AccordionItem title="How do I update my account information?">
                <p>You can manage your profile information, including your name, email, and avatar, by navigating to the "Profile" page. You can access this page from the dropdown menu by clicking your avatar in the header.</p>
            </AccordionItem>
            <AccordionItem title="Why can I only download by pasting a YouTube URL?">
                <p>Currently, the downloader page is built as a demonstration using a static example. The functionality to directly download a movie from its details page is part of our planned features to create a more seamless user experience.</p>
            </AccordionItem>
        </div>
    </StaticPageLayout>
  );
};

export default FAQPage;
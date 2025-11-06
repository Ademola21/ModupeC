import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';

const HelpSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">{title}</h2>
        {children}
    </section>
);

const HelpCenterPage: React.FC = () => {
  return (
    <StaticPageLayout title="Help Center">
      <p>
        Welcome to the CeniMax Help Center. Here you'll find answers to common questions about your account, downloading movies, and technical issues. We aim to provide you with a seamless experience, but if you can't find what you're looking for, please feel free to contact our support team.
      </p>

      <HelpSection title="Account Management">
        <p>
          Need to update your profile, change your password, or manage your notification settings? You can find all these options on your <strong>Profile Page</strong>. Simply click on your avatar in the top-right corner to access your account settings.
        </p>
      </HelpSection>

      <HelpSection title="Downloading Guide">
        <p>
          Our platform is designed for easy downloading. Find a movie you want, click the "Download Now" button, and select your desired format from the list. For a more detailed walkthrough, please visit our <strong>How to Download</strong> page.
        </p>
      </HelpSection>

      <HelpSection title="Troubleshooting">
        <p>
          If you're experiencing issues such as slow download speeds, playback problems, or website glitches, we recommend trying the following steps:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Clear your browser's cache and cookies.</li>
            <li>Ensure you have a stable and strong internet connection.</li>
            <li>Try using a different web browser to see if the issue persists.</li>
            <li>Make sure you have enough storage space on your device for the download.</li>
        </ul>
      </HelpSection>

       <HelpSection title="Contact Support">
        <p>
          Still need help? Our support team is here for you. Visit our <strong>Contact Us</strong> page to send us a message, and we'll get back to you as soon as possible.
        </p>
      </HelpSection>
    </StaticPageLayout>
  );
};

export default HelpCenterPage;
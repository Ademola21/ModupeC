import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';

const CookiePolicyPage: React.FC = () => {
  return (
    <StaticPageLayout title="Cookie Policy">
      <p className="font-semibold">Last Updated: October 26, 2024</p>
      <p>
        This Cookie Policy explains how CeniMax ("we," "us," or "our") uses cookies and similar technologies on our website. As this is a demonstration application, our use of such technologies is minimal and focused on core functionality.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">1. What are Cookies and Similar Technologies?</h2>
      <p>
        Cookies are small text files that are placed on your device by websites that you visit. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
      </p>
      <p className="mt-4">
        In our case, we primarily use <strong>Local Storage</strong>, a technology similar to cookies that allows websites to store and retrieve data in a browser without an expiration date.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">2. How We Use These Technologies</h2>
      <p>
        We use local storage for the following essential purposes:
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li>
          <strong>Preferences:</strong> We store your site preferences to provide a consistent experience. For example, when you select the 'dark' or 'light' theme, we save this choice in your browser's local storage so that your preferred theme is automatically applied on your next visit.
        </li>
      </ul>
      <p className="mt-4">
        We do not use cookies or local storage for tracking, advertising, or analytics purposes.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">3. Your Choices</h2>
      <p>
        You can control and manage cookies and local storage in various ways. Most browsers allow you to see what data you have stored and delete it individually, or block data from particular or all websites.
      </p>
      <p className="mt-4">
        Please be aware that if you delete or disable local storage, some features of the CeniMax service, such as your theme preference, may not function correctly.
      </p>
       <p className="mt-4">
        You can usually find these settings in the 'options' or 'preferences' menu of your browser.
      </p>
    </StaticPageLayout>
  );
};

export default CookiePolicyPage;
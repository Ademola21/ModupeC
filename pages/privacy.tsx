import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p className="font-semibold">Last Updated: October 26, 2024</p>
      <p>
        CeniMax ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose information about you when you use our website and services (collectively, the "Service").
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">1. Information We Collect</h2>
      <p>
        Since this is a demonstration application, we collect minimal information:
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li><strong>Account Information:</strong> When you sign up, we collect a name and an email address. This information is not stored in a persistent database and is used only for the purpose of demonstrating the application's features.</li>
        <li><strong>Local Storage:</strong> We may use your browser's local storage to save preferences, such as your preferred theme (light or dark), to enhance your user experience on subsequent visits.</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">2. How We Use Your Information</h2>
      <p>
        We use the information we collect solely to provide and improve the Service. This includes:
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li>Personalizing your experience (e.g., displaying your name and avatar).</li>
        <li>Remembering your settings and preferences.</li>
        <li>Operating and maintaining the Service.</li>
      </ul>
      <p className="mt-4">
        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">3. Data Security</h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security as this is a portfolio project.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">4. Cookies</h2>
      <p>
        We do not use cookies for tracking purposes. We may use local storage, which is a similar technology, to save your preferences. Please see our Cookie Policy for more details.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">5. Changes to This Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyPolicyPage;
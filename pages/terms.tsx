import React from 'react';
import { StaticPageLayout } from '@/components/StaticPageLayout';

const TermsOfServicePage: React.FC = () => {
  return (
    <StaticPageLayout title="Terms of Service">
      <p className="font-semibold">Last Updated: October 26, 2024</p>
      <p>
        Welcome to CeniMax. These Terms of Service ("Terms") govern your access to and use of the CeniMax website and services ("Service"). Please read these Terms carefully before using the Service.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
      <p>
        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. This is a demonstration application, and your use of it constitutes acknowledgment of its non-commercial, educational purpose.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">2. Use of Service</h2>
      <p>
        CeniMax provides a user interface for browsing movie information and simulating the download of media files. The Service is intended for personal, non-commercial use only. You agree not to use the Service for any illegal or unauthorized purpose.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">3. User Accounts</h2>
      <p>
        To access certain features, you may be required to create an account. You are responsible for safeguarding your password and for any activities or actions under your password. CeniMax cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">4. Intellectual Property</h2>
      <p>
        The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of CeniMax and its licensors. All movie posters, titles, and related media are the property of their respective copyright holders and are used here for demonstration purposes only.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">5. Disclaimer of Warranty</h2>
      <p>
        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Use of the Service is at your own risk. The Service is a demonstration project and is provided without warranties of any kind, whether express or implied, including, but not to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mt-8 mb-4">6. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
      </p>
    </StaticPageLayout>
  );
};

export default TermsOfServicePage;
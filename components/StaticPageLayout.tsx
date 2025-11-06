import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ title, children }) => {
  const router = useRouter();
  return (
    <div className="animate-fade-in container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-24">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center text-gray-800 dark:text-text-secondary hover:text-black dark:hover:text-white font-semibold transition-colors duration-300 group mb-8">
          <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back
        </button>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-text-primary mt-8 mb-12">
          {title}
        </h1>
        <div className="text-gray-600 dark:text-text-secondary leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

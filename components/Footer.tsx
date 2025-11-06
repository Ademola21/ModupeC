import React from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="text-gray-500 dark:text-text-muted hover:text-black dark:hover:text-text-primary transition-colors duration-300 text-left">
    {children}
  </Link>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-text-muted hover:text-black dark:hover:text-white transition-colors duration-300">
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  </a>
);

const FooterComponent: React.FC = () => {
  const { isAuthenticated } = useAppContext();
  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-background-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-text-secondary tracking-wider uppercase">Explore</h3>
            <ul className="space-y-3">
              <li><FooterLink href="/?section=genres">Genres</FooterLink></li>
              <li><FooterLink href="/?section=newReleases">New Releases</FooterLink></li>
              <li><FooterLink href="/?section=allMovies">All Movies</FooterLink></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-text-secondary tracking-wider uppercase">Support</h3>
            <ul className="space-y-3">
              <li><FooterLink href="/help">Help Center</FooterLink></li>
              <li><FooterLink href="/how-to-download">How to Download</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
              <li><FooterLink href="/faq">FAQ</FooterLink></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-text-secondary tracking-wider uppercase">Account</h3>
            <ul className="space-y-3">
              {isAuthenticated ? (
                <>
                  <li><FooterLink href="/profile">My Profile</FooterLink></li>
                  <li><FooterLink href="/downloader">My Downloads</FooterLink></li>
                  <li><FooterLink href="/profile">Settings</FooterLink></li>
                </>
              ) : (
                <li><FooterLink href="/login">Login / Sign Up</FooterLink></li>
              )}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-text-secondary tracking-wider uppercase">Legal</h3>
            <ul className="space-y-3">
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/dmca">DMCA Notice</FooterLink></li>
              <li><FooterLink href="/cookie-policy">Cookie Policy</FooterLink></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-background-secondary flex flex-col sm:flex-row justify-between items-center">
          <p className="text-base text-gray-500 dark:text-text-muted">&copy; 2024 CeniMax, Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <SocialIcon href="#">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </SocialIcon>
            <SocialIcon href="#">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </SocialIcon>
            <SocialIcon href="#">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.116 0-3.483.01-4.702.066-2.618.12-3.832 1.34-3.95 3.95-.056 1.22-.066 1.583-.066 4.702s.01 3.483.066 4.702c.119 2.618 1.332 3.832 3.95 3.95 1.22.056 1.583.066 4.702.066s3.483-.01 4.702-.066c2.618-.119 3.832-1.332 3.95-3.95.056-1.22.066-1.583.066-4.702s-.01-3.483-.066-4.702c-.119-2.618-1.332-3.832-3.95-3.95-1.22-.056-1.583-.066-4.702-.066zm0 2.99c2.41 0 4.373 1.963 4.373 4.373s-1.963 4.373-4.373 4.373-4.373-1.963-4.373-4.373 1.963-4.373 4.373-4.373zm0 1.802c-1.42 0-2.571 1.15-2.571 2.571s1.15 2.571 2.571 2.571 2.571-1.15 2.571-2.571-1.15-2.571-2.571-2.571zm4.618-3.078c-.765 0-1.385.62-1.385 1.385s.62 1.385 1.385 1.385 1.385-.62 1.385-1.385-.62-1.385-1.385-1.385z" />
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);

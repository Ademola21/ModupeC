import React from 'react';
import Link from 'next/link';

interface ProfileDropdownProps {
  onLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const DropdownItem: React.FC<{ href: string; onClick: () => void; children: React.ReactNode; isDanger?: boolean }> = ({ href, onClick, children, isDanger }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`block w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
        isDanger 
        ? 'text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' 
        : 'text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-background-tertiary'
    }`}
  >
    {children}
  </Link>
);

const LogoutButton: React.FC<{ onClick: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-3 text-sm transition-colors duration-200 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
    >
      {children}
    </button>
  );

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout, setIsOpen }) => {
  return (
    <div
      className="absolute top-full right-0 mt-4 w-48 bg-white/90 dark:bg-background-secondary/90 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 dark:border-background-tertiary overflow-hidden animate-fade-in"
      style={{ animationDuration: '200ms' }}
    >
      <div className="py-1">
        <DropdownItem href="/profile" onClick={() => setIsOpen(false)}>Profile</DropdownItem>
        <DropdownItem href="/downloader" onClick={() => setIsOpen(false)}>Downloads</DropdownItem>
        <LogoutButton onClick={() => { onLogout(); setIsOpen(false); }}>Log Out</LogoutButton>
      </div>
    </div>
  );
};

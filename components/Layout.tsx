import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/signup';

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-text-primary font-sans transition-colors duration-300">
      {!isAuthPage && <Header />}
      <main>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

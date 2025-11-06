import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SearchIcon } from './icons/SearchIcon';
import { ThemeToggleIcon } from './icons/ThemeToggleIcon';
import { ProfileDropdown } from './ProfileDropdown';
import { MenuIcon } from './icons/MenuIcon';
import { MobileMenu } from './MobileMenu';
import { useAppContext } from '@/context/AppContext';
import { SearchOverlay } from './SearchOverlay';
import { mockMovies } from '@/constants';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="text-text-tertiary hover:text-text-primary transition-colors duration-300 font-medium text-sm md:text-base">
    {children}
  </Link>
);

const HeaderComponent: React.FC = () => {
  const router = useRouter();
  const { theme, toggleTheme, userProfile, isAuthenticated, logout } = useAppContext();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const isDetailsPage = router.pathname.startsWith('/movie/');
  
  const headerClasses = isDetailsPage || isSearchOpen
    ? "sticky top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-primary/80 backdrop-blur-lg shadow-md"
    : "absolute top-0 left-0 right-0 z-50";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  const filteredMovies = React.useMemo(() => {
    if (!searchTerm) return [];
    return mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        movies={filteredMovies}
      />
      <header className={headerClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-8">
              <Link href="/" className={`text-2xl sm:text-3xl font-black tracking-wide ${isDetailsPage ? 'text-black dark:text-white' : 'text-white'}`}>
                CeniMax
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/">Movies</NavLink>
                <NavLink href="/">Series</NavLink>
                <NavLink href="/">Kids</NavLink>
              </nav>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
                <button onClick={() => setIsSearchOpen(true)} className="text-text-tertiary hover:text-white transition-colors">
                  <SearchIcon className="w-6 h-6" />
                </button>
                <button onClick={toggleTheme} className="text-text-tertiary hover:text-white transition-colors">
                  <ThemeToggleIcon theme={theme} className="w-6 h-6" />
                </button>
                
                {isAuthenticated && userProfile ? (
                    <div className="relative" ref={profileMenuRef}>
                        <button 
                            onClick={() => setIsProfileOpen(prev => !prev)} 
                            className="w-9 h-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-background-primary focus:ring-white"
                        >
                            <img src={userProfile.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                        </button>
                        {isProfileOpen && <ProfileDropdown onLogout={handleLogout} setIsOpen={setIsProfileOpen} />}
                    </div>
                ) : (
                    <div className="hidden md:flex items-center space-x-2">
                        <Link href="/login" className="px-4 py-2 rounded-full text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
                            Login
                        </Link>
                         <Link href="/signup" className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-black hover:bg-opacity-90 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                )}

                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-text-tertiary hover:text-white transition-colors">
                  <MenuIcon className="w-6 h-6" />
                </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
};

export const Header = React.memo(HeaderComponent);

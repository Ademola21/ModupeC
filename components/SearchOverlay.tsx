import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { SearchIcon } from './icons/SearchIcon';
import { CloseIcon } from './icons/CloseIcon';
import { MovieCard } from './MovieCard';
import type { Movie } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  movies: Movie[];
}

const SearchOverlayComponent: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  movies,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  
  const hasResults = movies.length > 0;
  const isSearching = searchTerm.length > 0;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-lg animate-fade-in flex flex-col items-center p-4 pt-20 md:pt-24"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 dark:text-text-muted hover:text-black dark:hover:text-white transition-colors">
                <CloseIcon className="w-8 h-8" />
            </button>
            <div className="bg-transparent rounded-lg w-full mb-8">
              <div className="relative flex-grow w-full max-w-2xl mx-auto">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for movies, series, and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-background-tertiary/80 border-2 border-transparent rounded-full py-4 pl-12 pr-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all duration-300 text-lg"
                />
              </div>
            </div>
        </div>
        
        <div className="flex-grow overflow-y-auto pb-8">
            {isSearching && hasResults && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {movies.map((movie) => (
                      <div key={movie.id} onClick={() => handleMovieClick(movie)}>
                        <MovieCard movie={movie} />
                      </div>
                    ))}
                </div>
            )}
            
            {isSearching && !hasResults && (
                <div className="text-center pt-16">
                    <h2 className="text-2xl text-gray-800 dark:text-text-primary">No results found for "{searchTerm}"</h2>
                    <p className="text-gray-500 dark:text-text-muted mt-2">Try checking for typos or using a different keyword.</p>
                </div>
            )}

            {!isSearching && (
                <div className="text-center pt-16">
                    <h2 className="text-2xl text-gray-800 dark:text-text-primary">Find your next favorite movie</h2>
                    <p className="text-gray-500 dark:text-text-muted mt-2">Start typing above to search our entire library.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export const SearchOverlay = React.memo(SearchOverlayComponent);

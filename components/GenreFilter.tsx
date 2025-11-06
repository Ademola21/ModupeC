import React from 'react';

interface GenreFilterProps {
  genres: string[];
  activeGenre: string;
  onGenreChange: (genre: string) => void;
}

const GenreFilterComponent: React.FC<GenreFilterProps> = ({ genres, activeGenre, onGenreChange }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreChange(genre)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-primary focus:ring-gray-800 dark:focus:ring-white
            ${
              activeGenre === genre
                ? 'bg-gray-900 text-white dark:bg-white dark:text-black scale-105 shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:bg-background-tertiary dark:text-text-secondary dark:hover:bg-background-tertiary/70 dark:hover:text-text-primary'
            }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export const GenreFilter = React.memo(GenreFilterComponent);
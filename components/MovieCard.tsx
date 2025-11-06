import React from 'react';
import Link from 'next/link';
import type { Movie } from '../types';
import { StarIcon } from './icons/StarIcon';

interface MovieCardProps {
  movie: Movie;
}

const MovieCardComponent: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="bg-white dark:bg-background-secondary rounded-lg overflow-hidden transform hover:scale-105 cursor-pointer shadow-lg dark:shadow-black/20 block transition-transform duration-300"
    >
      <div className="relative aspect-[2/3] bg-background-secondary">
        <img 
          className="absolute inset-0 w-full h-full object-cover"
          src={movie.posterUrl} 
          alt={movie.title}
          loading="eager"
        />
        
        {movie.part && movie.part > 1 && (
            <div className="absolute top-2 left-2 flex items-center bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                PART {movie.part}
            </div>
        )}

        <div className="absolute top-2 right-2 flex items-center bg-black/70 backdrop-blur-sm text-white text-sm font-bold px-2.5 py-1.5 rounded-full z-10">
          <StarIcon className="w-4 h-4 text-yellow-400 mr-1.5" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
          <h3 className="text-gray-900 dark:text-white font-bold text-lg truncate">
              {movie.title}
          </h3>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-text-muted">
            <span>{movie.genres[0]}</span>
            <span>{movie.year}</span>
          </div>
      </div>
    </Link>
  );
};

export const MovieCard = React.memo(MovieCardComponent);

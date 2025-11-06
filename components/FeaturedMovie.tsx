import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { Movie } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface FeaturedMovieProps {
  movie: Movie;
}

const DetailsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
  </svg>
);


const FeaturedMovieComponent: React.FC<FeaturedMovieProps> = ({ movie }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const router = useRouter();

  return (
    <div className="relative h-[80vh] w-full text-white animate-fade-in-slow bg-background-secondary">
       <img
        src={movie.posterUrl}
        alt={`Featured movie: ${movie.title}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="eager"
        onLoad={() => setIsImageLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-background-primary/30 to-transparent" />
      <div className="relative z-10 flex flex-col justify-center h-full container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl pt-24">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg leading-tight">
            {movie.title}
          </h1>
          <p className="mt-4 text-text-secondary line-clamp-3 text-lg leading-relaxed max-w-lg">
            {movie.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => router.push('/downloader')}
              className="flex items-center justify-center bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105"
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Download Now
            </button>
            <Link 
              href={`/movie/${movie.id}`}
              className="flex items-center justify-center bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full hover:bg-white/30 transition-colors duration-300"
            >
              Details
              <DetailsIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturedMovie = React.memo(FeaturedMovieComponent);

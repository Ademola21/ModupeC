import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { Movie, Comment } from '@/types';
import { mockComments, mockMovies } from '@/constants';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlayIcon } from './icons/PlayIcon';
import { StarIcon } from './icons/StarIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { useAppContext } from '@/context/AppContext';

// Social Media Icons
const TwitterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
  
const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
);
  
const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.3-1.38c1.37.72 2.93 1.15 4.59 1.15h.11c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm0 0c-.02 0-.03 0-.05 0h-.02zm4.55 13.5c-.24.13-.53.2-1.61.08-1.08-.12-1.79-.53-2.5-1.21-.7-.68-1.1-1.55-1.18-1.68-.08-.13-.68-.91-.68-1.71s.41-1.19.53-1.32c.12-.13.27-.16.39-.16s.24-.05.35.18c.11.23.38.88.41.94.03.06.05.13 0 .23-.05.1-.11.16-.23.28-.12.13-.2.2-.28.33-.08.13-.16.28 0 .48.16.2.35.41.76.81.55.53 1.05.9 1.21 1.03.16.13.26.1.38-.03.12-.13.53-.61.68-.81.16-.2.3-.16.5-.1.2.06 1.24.58 1.45.68.21.1.35.16.4.23.03.08.03.48-.21.61z" />
    </svg>
);
  
const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.13-.05.29-.12.395l-2.844 10.152c-.12.432-.33.54-.586.54-.424 0-.6-.18-.84-.378l-3.32-2.454-1.614 1.554c-.171.171-.315.315-.621.315l.222-3.393L16.03 8.3c.27-.24.09-.378-.222-.222l-4.148 2.604-3.32-1.028c-.432-.12-.444-.432.09-.612l10.128-3.912z" />
    </svg>
);


interface MovieDetailsProps {
  movie: Movie;
}

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">{title}</h2>
        {children}
    </section>
)

const MovieDetailsComponent: React.FC<MovieDetailsProps> = ({ movie }) => {
  const router = useRouter();
  const { userProfile } = useAppContext();
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);
  
  const movieSeries = useMemo(() => {
    if (!movie.part) return [];
    return mockMovies
      .filter(m => m.title === movie.title && m.part)
      .sort((a, b) => (a.part || 0) - (b.part || 0));
  }, [movie.title, movie.part]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
        alert("Please log in to post a comment.");
        return;
    }
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        user: userProfile.name,
        avatar: userProfile.avatarUrl,
        timestamp: 'Just now',
        text: newComment.trim(),
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };
  
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this movie: ${movie.title}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };
  
  return (
    <div className="animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8">
        {/* Back button */}
        <div className="mb-6">
            <button 
                onClick={() => router.push('/')} 
                className="flex items-center text-gray-800 dark:text-text-secondary hover:text-black dark:hover:text-white font-semibold transition-colors duration-300 group"
            >
                <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to home
            </button>
        </div>

        {/* Movie Details Flex Container */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            
            {/* Poster Image */}
            <div className="md:w-1/3 flex-shrink-0">
                <img
                    src={movie.posterUrl}
                    alt={`Poster for ${movie.title}`}
                    className={`w-full h-auto object-cover rounded-lg shadow-2xl dark:shadow-black/40 transition-opacity duration-500 ${isPosterLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="eager"
                    onLoad={() => setIsPosterLoaded(true)}
                />
            </div>

            {/* Movie Info */}
            <div className="md:w-2/3">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-text-primary leading-tight">
                    {movie.title}
                </h1>
                
                <div className="flex items-center flex-wrap space-x-4 mt-4 text-gray-700 dark:text-text-secondary">
                    <span>{movie.year}</span>
                    <span className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                        {movie.rating.toFixed(1)}
                    </span>
                    {movie.part && <span className="font-bold">Part {movie.part}</span>}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {movie.genres.map(genre => (
                        <span key={genre} className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800 dark:bg-background-secondary dark:text-text-secondary">
                            {genre}
                        </span>
                    ))}
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">Synopsis</h2>
                    <p className="text-gray-600 dark:text-text-secondary leading-relaxed max-w-3xl">
                        {movie.description}
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                     <button 
                        onClick={() => router.push('/downloader')}
                        className="flex items-center justify-center bg-gray-800 dark:bg-white text-white dark:text-black font-bold py-3 px-6 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105"
                     >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Download Now
                    </button>
                    <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-gray-200/80 dark:bg-white/20 backdrop-blur-sm text-gray-800 dark:text-white font-bold py-3 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-white/30 transition-colors duration-300">
                        <PlayIcon className="w-5 h-5 mr-2" />
                        Watch Trailer
                    </a>
                </div>
            </div>
        </div>

        {/* Other Sections */}
        <div className="mt-16 space-y-12">
            {/* Parts Section */}
            {movieSeries.length > 1 && (
                <Section title="Parts">
                    <div className="flex flex-wrap gap-3">
                        {movieSeries.map(partMovie => (
                            <button
                                key={partMovie.id}
                                onClick={() => router.push(`/movie/${partMovie.id}`)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-primary focus:ring-gray-800 dark:focus:ring-white
                                ${
                                    movie.id === partMovie.id
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-black scale-105 shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:bg-background-tertiary dark:text-text-secondary dark:hover:bg-background-tertiary/70 dark:hover:text-text-primary'
                                }`}
                            >
                                Part {partMovie.part}
                            </button>
                        ))}
                    </div>
                </Section>
            )}
            
            {/* Cast Section */}
            <Section title="Cast">
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {movie.cast.map((actor, index) => (
                        <div key={index} className="flex-shrink-0 text-center w-24">
                            <img src={actor.avatarUrl} alt={actor.name} className="w-20 h-20 rounded-full mx-auto object-cover shadow-md" />
                            <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-text-primary">{actor.name}</p>
                        </div>
                    ))}
                </div>
            </Section>
            
            {/* Share Section */}
            <Section title="Share">
                <div className="flex items-center space-x-4">
                    <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" title="Share on X" className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-background-secondary rounded-full text-gray-800 dark:text-text-primary hover:bg-gray-200 dark:hover:bg-background-tertiary transition-colors duration-300">
                        <TwitterIcon className="w-5 h-5" />
                    </a>
                    <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-background-secondary rounded-full text-gray-800 dark:text-text-primary hover:bg-gray-200 dark:hover:bg-background-tertiary transition-colors duration-300">
                        <FacebookIcon className="w-6 h-6" />
                    </a>
                    <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-background-secondary rounded-full text-gray-800 dark:text-text-primary hover:bg-gray-200 dark:hover:bg-background-tertiary transition-colors duration-300">
                        <WhatsAppIcon className="w-6 h-6" />
                    </a>
                    <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" title="Share on Telegram" className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-background-secondary rounded-full text-gray-800 dark:text-text-primary hover:bg-gray-200 dark:hover:bg-background-tertiary transition-colors duration-300">
                        <TelegramIcon className="w-6 h-6" />
                    </a>
                </div>
            </Section>

            {/* Comments Section */}
            <Section title="Comments">
                <div className="max-w-2xl">
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={userProfile ? "Add a comment..." : "Please log in to comment."}
                            className="w-full bg-gray-100 dark:bg-background-secondary rounded-lg p-4 text-black dark:text-white placeholder-gray-500 dark:placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors duration-300 disabled:opacity-50"
                            rows={3}
                            disabled={!userProfile}
                        />
                        <button type="submit" className="mt-4 px-6 py-2 bg-gray-800 dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" disabled={!userProfile}>
                            Post Comment
                        </button>
                    </form>
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-4">
                                <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1 bg-gray-50 dark:bg-background-secondary p-4 rounded-lg">
                                    <div className="flex items-baseline justify-between">
                                        <p className="font-bold text-gray-800 dark:text-text-primary">{comment.user}</p>
                                        <p className="text-xs text-gray-500 dark:text-text-muted">{comment.timestamp}</p>
                                    </div>
                                    <p className="mt-2 text-gray-600 dark:text-text-secondary">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
      </div>
    </div>
  );
};

export const MovieDetails = React.memo(MovieDetailsComponent);

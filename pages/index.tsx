import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { FeaturedMovie } from '@/components/FeaturedMovie';
import { MovieCard } from '@/components/MovieCard';
import { SearchOverlay } from '@/components/SearchOverlay';
import { GenreFilter } from '@/components/GenreFilter';
import { mockMovies, genreList, newReleasesMovies } from '@/constants';
import type { Movie } from '@/types';
import { Pagination } from '@/components/Pagination';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainGenre, setActiveMainGenre] = useState('All Popular');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [featuredMovieIndex, setFeaturedMovieIndex] = useState(0);
  const [allMoviesPage, setAllMoviesPage] = useState(1);
  const MOVIES_PER_PAGE = 10;
  
  const newReleasesSectionRef = useRef<HTMLElement>(null);
  const genreFilterSectionRef = useRef<HTMLElement>(null);
  const allMoviesSectionRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);
  const shouldScrollToMovies = useRef(false);

  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('homepage_scroll', window.scrollY.toString());
    };

    router.events?.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events?.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('homepage_scroll');
    if (savedScroll && router.asPath === '/') {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem('homepage_scroll');
      }, 0);
    }
  }, [router.asPath]);


  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedMovieIndex(prevIndex => (prevIndex + 1) % mockMovies.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (shouldScrollToMovies.current) {
      allMoviesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      shouldScrollToMovies.current = false;
    }
  }, [allMoviesPage]);

  useEffect(() => {
    setAllMoviesPage(1);
    if(activeMainGenre !== 'All Popular') {
       genreFilterSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeMainGenre]);
  
  useEffect(() => {
    const { section } = router.query;
    if(section) {
        let targetRef;
        if (section === 'newReleases') targetRef = newReleasesSectionRef;
        else if (section === 'genres') targetRef = genreFilterSectionRef;
        else if (section === 'allMovies') targetRef = allMoviesSectionRef;
        
        targetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [router.query]);

  const featuredMovie = useMemo(() => mockMovies[featuredMovieIndex], [featuredMovieIndex]);
  const trendingMovies = useMemo(() => mockMovies, []);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    return mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredByGenreMovies = useMemo(() => {
    if (activeMainGenre === 'All Popular') {
      return mockMovies;
    }
    return mockMovies.filter(movie => movie.genres.includes(activeMainGenre));
  }, [activeMainGenre]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (allMoviesPage - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    return filteredByGenreMovies.slice(startIndex, endIndex);
  }, [allMoviesPage, filteredByGenreMovies]);

  const totalPages = Math.ceil(filteredByGenreMovies.length / MOVIES_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    shouldScrollToMovies.current = true;
    setAllMoviesPage(page);
  }, []);

  return (
    <>
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        movies={filteredMovies}
      />
      <FeaturedMovie movie={featuredMovie} key={featuredMovie.id} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <section ref={newReleasesSectionRef}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">New Releases</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {newReleasesMovies.slice(0, 4).map((movie) => (
              <MovieCard key={`${movie.id}-new`} movie={movie} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">Trending Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {trendingMovies.slice(0, 10).map((movie) => (
              <MovieCard key={`${movie.id}-trending`} movie={movie} />
            ))}
          </div>
        </section>
        
        <section ref={genreFilterSectionRef}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">Browse by Genre</h2>
          <GenreFilter
            genres={genreList}
            activeGenre={activeMainGenre}
            onGenreChange={setActiveMainGenre}
          />
        </section>

        <section ref={allMoviesSectionRef}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">All movies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {paginatedMovies.map((movie) => (
              <MovieCard key={`${movie.id}-all`} movie={movie} />
            ))}
          </div>
            {totalPages > 1 && (
            <Pagination
                currentPage={allMoviesPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            )}
        </section>

      </div>
    </>
  );
};

export default HomePage;

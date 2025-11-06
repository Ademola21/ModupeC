import React from 'react';
import { useRouter } from 'next/router';
import { MovieDetails } from '@/components/MovieDetails';
import { mockMovies } from '@/constants';

const MovieDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const movie = mockMovies.find(m => m.id === Number(id));

    if (!movie) {
        if(typeof window !== 'undefined' && id) {
             router.replace('/');
        }
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading movie...</p>
            </div>
        );
    }

    return <MovieDetails key={movie.id} movie={movie} />;
};

export default MovieDetailsPage;

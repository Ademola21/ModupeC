export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  rating: number;
  year: number;
  part?: number;
  genres: string[];
  description: string;
  cast: { name: string; avatarUrl: string; }[];
  trailerUrl: string;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  timestamp: string;
  text: string;
}

export interface UserProfile {
    name: string;
    email: string;
    avatarUrl: string;
}
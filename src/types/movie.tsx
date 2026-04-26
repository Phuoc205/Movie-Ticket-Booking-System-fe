import type { Showtime } from "./Showtime";

export interface Movie {
  id: string;
  title: string;
  description?: string;
  duration: number;
  poster_url: string;
  trailer_url: string;
  genre: string;
  release_date: string;
  status: string;
  showtimes?: Showtime[];
}


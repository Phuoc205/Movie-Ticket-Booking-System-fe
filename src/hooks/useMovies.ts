import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  duration: number;
  release_date: string;
  trailer_url?: string;
  genre: string;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/movies');
      setMovies(res.data);
    } catch {
      toast.error('Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const fetchComingSoon = async () => {
    try {
      const res = await api.get("/movies", {
        params: { status: "COMING_SOON" }
      });
      setComingSoon(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchMovies = async (keyword: string) => {
    setSearching(true);
    try {
      const res = await api.get(`/movies/search?name=${encodeURIComponent(keyword)}`);
      setMovies(res.data);
    } catch {
      toast.error('Lỗi tìm kiếm');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchComingSoon();
  }, []);

  return {
    movies,
    comingSoon,
    loading,
    searching,
    fetchMovies,
    searchMovies,
  };
};
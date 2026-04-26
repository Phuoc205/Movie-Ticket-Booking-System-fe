import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Movie } from '../types/movie';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [classic, setClassic] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get<Movie[]>('/movies');

      const all = res.data;

      setMovies(all);
      setNowShowing(all.filter(m => m.status === "NOW_SHOWING"));
      setClassic(all.filter(m => m.status === "CLASSIC"));
      setComingSoon(all.filter(m => m.status === "UPCOMING"));

    } catch {
      toast.error('Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (keyword: string) => {
    setSearching(true);
    try {
      const res = await api.get(
        `/movies/search?name=${encodeURIComponent(keyword)}`
      );
      setMovies(res.data);
    } catch {
      toast.error('Lỗi tìm kiếm');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    movies,
    nowShowing,
    comingSoon,
    classic,
    loading,
    searching,
    fetchMovies,
    searchMovies,
  };
};
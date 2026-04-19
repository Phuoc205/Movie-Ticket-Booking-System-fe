import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export const useMovieDetail = (id?: string) => {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        setMovie(res.data);
      } catch {
        toast.error("Không thể tải chi tiết phim");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return { movie, loading };
};
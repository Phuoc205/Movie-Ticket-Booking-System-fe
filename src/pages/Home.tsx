import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import Trailer from '../components/Trailer';
import MovieGrid from '../components/MovieGrid';
import SubHeader from '../components/SubHeader';

import './css/Home.css';
import type { Movie } from '../types/movie';

const Home = () => {
  const {
    nowShowing,
    comingSoon,
    classic,
    loading,
    searchMovies,
    fetchMovies
  } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  const scrollToNowShowing = () => {
    document.getElementById("nowShowing")?.scrollIntoView({
      behavior: "smooth"
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchMovies();
      return;
    }

    await searchMovies(query);

    setTimeout(() => {
      scrollToNowShowing();
    }, 100);
  };

  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const videoId = u.searchParams.get("v") || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch {
      return "";
    }
  };

  return (
    <div className="page-container">
      <SubHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={(e: any) => {
          e.preventDefault();
          handleSearch(searchQuery);
        }}
      />
      <Trailer />

      {/*PHIM ĐANG CHIẾU */}
      <div className="max-w-7xl mx-auto px-4 mt-8" id='nowShowing'>
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-green-500 pl-4">
          Phim Đang Chiếu
        </h2>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="spinner" />
          </div>
        ) : nowShowing.length > 0 ? (
          <MovieGrid
            movies={nowShowing}
          />
        ) : (
          <div className="text-center py-24 text-gray-400">
            Không tìm thấy phim
          </div>
        )}
      </div>

      {/*PHIM SẮP CHIẾU */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pb-20" id='comingSoon'>
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-yellow-500 pl-4">
          Phim Sắp Chiếu
        </h2>

        {comingSoon.length > 0 ? (
          <MovieGrid
            movies={comingSoon}
            onOpenTrailer={setTrailerMovie}
          />
        ) : (
          <div className="text-gray-400 text-center py-10">
            Chưa có phim sắp chiếu
          </div>
        )}
      </div>

      {/*PHIM ĐÃ CHIẾU */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pb-20" id='classic'>
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-gray-500 pl-4">
          Phim Đã Chiếu
        </h2>

        {classic.length > 0 ? (
          <MovieGrid
            movies={classic}
            onOpenTrailer={setTrailerMovie}
          />
        ) : (
          <div className="text-gray-400 text-center py-10">
            Chưa có phim đã chiếu
          </div>
        )}
      </div>

      {trailerMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[80%] aspect-video">
            <iframe
              className="w-full h-full rounded-xl"
              src={getEmbedUrl(trailerMovie.trailer_url || "")}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            <button
              onClick={() => setTrailerMovie(null)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setTrailerMovie(null)}
          />
        </div>
      )}

    </div>
  );
};

export default Home;
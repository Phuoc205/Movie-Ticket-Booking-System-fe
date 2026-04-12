import React, { useState, useEffect } from 'react';
import './css/Home.css';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  duration: number;
  release_date: string;
  genre: string;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/movies');
      setMovies(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách phim. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchMovies();
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(`/movies/search?name=${encodeURIComponent(searchQuery)}`);
      setMovies(response.data);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="page-container">
      {/* Header/Hero Section */}
      <div className="home-hero mx-4 lg:mx-auto max-w-7xl mt-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="z-10 relative">
            <h1 className="page-title mb-3">
              Phim Đang Chiếu
            </h1>
            <p className="text-gray-400 text-lg font-light tracking-wide">Đặt vé ngay để thưởng thức những bộ phim bom tấn</p>
          </div>

          <form onSubmit={handleSearch} className="home-search">
            <input
              type="text"
              placeholder="Tìm kiếm tên phim..."
              className="input-field rounded-r-none w-full !bg-gray-900/80 !backdrop-blur-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="btn-primary rounded-l-none !rounded-r-xl min-w-[120px]"
            >
              {isSearching ? <div className="spinner-small"></div> : 'Tìm Kiếm'}
            </button>
          </form>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="spinner"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="home-movies-grid">
            {movies.map((movie) => (
              <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card group">
                
                <div className="movie-poster-placeholder">
                  {movie.poster_url ? (
                    <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>Chưa có poster</span>
                  )}
                  <div className="movie-poster-overlay"></div>
                  <div className="movie-duration-badge">{movie.duration} Phút</div>
                </div>

                <div className="movie-card-content">
                  <h3 className="movie-card-title">{movie.title}</h3>
                  <div className="movie-card-genre">{movie.genre}</div>
                  <p className="movie-card-description">{movie.description}</p>
                  
                  <div className="movie-card-footer">
                    <span>Khởi chiếu: {new Date(movie.release_date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

              </Link>
            ))}
          </div>
        ) : (
          <div className="card-container text-center py-24 flex flex-col justify-center items-center">
            <h3 className="text-3xl text-gray-200 font-bold mb-4">Không tìm thấy phim nào</h3>
            <p className="text-gray-400 text-lg">Hãy thử từ khóa khác hoặc quay lại sau.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

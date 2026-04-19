import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  genre?: string;
  poster_url: string;
  trailer_url: string;
  status?: string;
}


const ManageMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoadingMovies, setIsLoadingMovies] = useState(false);
    const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: '', genre: '', release_date: '', poster_url: '', trailer_url: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    const fetchMovies = async () => {
        setIsLoadingMovies(true);
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch {
            toast.error('Lỗi load phim');
        } finally {
            setIsLoadingMovies(false);
        }
    };

    const handleAddMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                title: newMovie.title,
                description: newMovie.description,
                duration: Number(newMovie.duration),

                genre: newMovie.genre || undefined,
                poster_url: newMovie.poster_url || undefined,
                trailer_url: newMovie.trailer_url || undefined,

                release_date: newMovie.release_date
                    ? new Date(newMovie.release_date)
                    : undefined,
            };

            if (editingMovie) {
                await api.put(`/movies/${editingMovie.id}`, payload);
                toast.success('Cập nhật phim thành công');
                setEditingMovie(null);
            } else {
                await api.post('/movies', payload);
                toast.success('Thêm phim thành công');
            }

            setNewMovie({
                title: '',
                description: '',
                duration: '',
                genre: '',
                release_date: '',
                poster_url: '',
                trailer_url: ''
            });

            fetchMovies();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi khi xử lý phim');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditMovie = (movie: Movie) => {
        setEditingMovie(movie);
        setNewMovie({
            title: movie.title,
            description: movie.description,
            duration: String(movie.duration),
            genre: movie.genre || '',
            release_date: movie.release_date ? new Date(movie.release_date).toISOString().slice(0, 16): '',
            poster_url: movie.poster_url || '',
            trailer_url: movie.trailer_url || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingMovie(null);
        setNewMovie({
            title: '',
            description: '',
            duration: '',
            genre: '',
            release_date: '',
            poster_url: '',
            trailer_url: ''
        });
    };

    const handleDeleteMovie = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa phim này?')) return;
        try {
            await api.delete(`/movies/${id}`);
            toast.success('Đã xóa phim');
            setMovies(prev => prev.filter(m => m.id !== id));
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Có lỗi khi xóa phim');
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    return (
          <div className="animate-fade-in-up space-y-8">
            {/* Form Thêm Phim */}
            <div className="card-container !bg-gray-900/40">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-purple-600 flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">🎬</span>
                {editingMovie ? `Sửa Phim: ${editingMovie.title}` : 'Thêm Phim Mới'}
              </h2>
              <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="input-label">Tên Phim</label>
                  <input
                    type="text"
                    required
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                    className="input-field"
                    placeholder="VD: Inception"
                  />
                </div>
                <div>
                  <label className="input-label">Thời lượng (phút)</label>
                  <input
                    type="number"
                    required
                    value={newMovie.duration}
                    onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                    className="input-field"
                    placeholder="VD: 148"
                  />
                </div>

                <div>
                  <label className="input-label">Thể loại</label>
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                    className="input-field"
                    placeholder="VD: Action"
                  />
                </div>
                <div>
                  <label className="input-label">Ngày phát hành</label>
                  <input
                    type="datetime-local"
                    value={newMovie.release_date}
                    onChange={(e) => setNewMovie({...newMovie, release_date: e.target.value})}
                    className="input-field text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="input-label">URL Poster Phim</label>
                  <input
                    type="url"
                    value={newMovie.poster_url}
                    onChange={(e) => setNewMovie({...newMovie, poster_url: e.target.value})}
                    className="input-field"
                    placeholder="VD: https://example.com/poster.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="input-label">URL Trailer Phim</label>
                  <input
                    type="url"
                    value={newMovie.trailer_url}
                    onChange={(e) => setNewMovie({...newMovie, trailer_url: e.target.value})}
                    className="input-field"
                    placeholder="VD: https://youtube.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="input-label">Mô tả nội dung</label>
                  <textarea
                    required
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Nhập nội dung phim..."
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t border-[var(--border-card)]">
                  {editingMovie && (
                    <button type="button" onClick={handleCancelEdit} className="btn-tab min-w-[120px]">
                      Hủy
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${editingMovie ? 'btn-primary' : 'btn-success'} min-w-[200px]`}
                  >
                    {isSubmitting ? <div className="spinner-small mr-2"></div> : null}
                    {isSubmitting ? 'Đang Xử Lý' : editingMovie ? 'Cập Nhật Phim' : 'Thêm Phim'}
                  </button>
                </div>
              </form>
            </div>

            {/* Danh Sách Phim */}
            <div className="card-container !p-0 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[var(--border-card)]">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">📂</span>
                  Kho Phim Của Rạp
                </h2>
              </div>
              {isLoadingMovies ? (
                <div className="flex justify-center py-16">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-gray-400 uppercase text-xs tracking-widest font-semibold">
                        <th className="p-5 w-24 border-b border-[var(--border-card)]">ID</th>
                        <th className="p-5 border-b border-[var(--border-card)]">Tên Phim</th>
                        <th className="p-5 border-b border-[var(--border-card)]">Thời lượng</th>
                        <th className="p-5 text-center border-b border-[var(--border-card)]">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-card)] text-gray-300">
                      {movies.map(movie => (
                        <tr key={movie.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-5 text-gray-500 font-mono text-xs">...{movie.id.substring(movie.id.length - 6)}</td>
                          <td className="p-5 font-bold text-white group-hover:text-[var(--accent-blue)] transition-colors">{movie.title}</td>
                          <td className="p-5 text-gray-400">{movie.duration} phút</td>
                          <td className="p-5 text-center flex justify-center gap-3">
                            <button
                              onClick={() => handleEditMovie(movie)}
                              className="btn-primary !py-2 !px-4 text-sm"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie.id)}
                              className="btn-danger"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
};

export default ManageMovies;
import React, { useState, useEffect } from 'react';
import './css/Dashboard.css';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Report {
  revenue: number;
  total_tickets: number;
  // Các field thống kê khác tùy backend trả về
  date?: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  genre?: string;
  status?: string;
}

interface Room {
  id: string;
  name: string;
  total_seats: number;
}

interface BookingAdmin {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  user?: { full_name: string; email: string };
  showtime?: {
    start_time: string;
    movie: { title: string };
    room: { name: string };
  };
  booking_seats?: {
    seat: { seat_number: string };
  }[];
}

interface Voucher {
  id: string;
  code: string;
  discount: number;
  is_active: boolean;
}

interface ShowtimeAdmin {
  id: string;
  start_time: string;
  end_time: string;
  price: number;
  movie: { title: string };
  room: { name: string };
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'MOVIES' | 'SHOWTIMES' | 'BOOKINGS' | 'VOUCHERS'>('REPORTS');
  
  // Reports State
  const [reportData, setReportData] = useState<Report | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Movies State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  
  // Form State
  const [newMovie, setNewMovie] = useState({ title: '', description: '', duration: '', release_date: '', poster_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Vouchers State
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [newVoucher, setNewVoucher] = useState({ code: '', discount: '' });
  const [isSubmittingVoucher, setIsSubmittingVoucher] = useState(false);

  // Showtimes State
  const [showtimes, setShowtimes] = useState<ShowtimeAdmin[]>([]);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
  const [newShowtime, setNewShowtime] = useState({ movie_id: '', room_id: '', start_time: '', price: 65000 });
  const [isSubmittingShowtime, setIsSubmittingShowtime] = useState(false);

  useEffect(() => {
    api.get('/rooms').then(res => setRooms(res.data)).catch(() => {});
  }, []);

  // Bookings State
  const [allBookings, setAllBookings] = useState<BookingAdmin[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    if (activeTab === 'REPORTS') {
      fetchReports();
    } else if (activeTab === 'MOVIES') {
      fetchMovies();
    } else if (activeTab === 'BOOKINGS') {
      fetchAllBookings();
    } else if (activeTab === 'VOUCHERS') {
      fetchVouchers();
    } else if (activeTab === 'SHOWTIMES') {
      fetchShowtimes();
      fetchMovies(); // need movies for dropdown
    }
  }, [activeTab]);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
      const response = await api.get('/reports');
      setReportData(response.data);
    } catch (error) {
      toast.error('Không thể lấy báo cáo thống kê');
    } finally {
      setIsLoadingReports(false);
    }
  };

  const fetchMovies = async () => {
    setIsLoadingMovies(true);
    try {
      const response = await api.get('/movies');
      setMovies(response.data);
    } catch (error) {
      toast.error('Không thể lấy danh sách phim');
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const fetchAllBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const response = await api.get('/bookings/history');
      setAllBookings(response.data);
    } catch (error) {
      toast.error('Không thể lấy danh sách vé');
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const fetchVouchers = async () => {
    setIsLoadingVouchers(true);
    try {
      const response = await api.get('/voucher');
      setVouchers(response.data);
    } catch (error) {
      toast.error('Không thể lấy danh sách voucher');
    } finally {
      setIsLoadingVouchers(false);
    }
  };

  const fetchShowtimes = async () => {
    setIsLoadingShowtimes(true);
    try {
      const response = await api.get('/showtimes');
      setShowtimes(response.data);
    } catch (error) {
      toast.error('Không thể lấy danh sách lịch chiếu');
    } finally {
      setIsLoadingShowtimes(false);
    }
  };

  const handleAddShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowtime.movie_id || !newShowtime.room_id || !newShowtime.start_time) {
      toast.error('Vui lòng chọn đầy đủ bộ phim, phòng và thời gian');
      return;
    }
    setIsSubmittingShowtime(true);
    try {
      await api.post('/showtimes', {
        ...newShowtime,
        price: Number(newShowtime.price),
      });
      toast.success('Tạo lịch chiếu thành công');
      setNewShowtime({ movie_id: '', room_id: '', start_time: '', price: 65000 });
      fetchShowtimes();
    } catch (error: any) {
      toast.error('Có lỗi khi tạo lịch chiếu');
    } finally {
      setIsSubmittingShowtime(false);
    }
  };

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVoucher(true);
    try {
      await api.post('/voucher', {
        code: newVoucher.code.toUpperCase(),
        discount: Number(newVoucher.discount),
      });
      toast.success('Thêm voucher thành công');
      setNewVoucher({ code: '', discount: '' });
      fetchVouchers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Có lỗi khi thêm voucher');
    } finally {
      setIsSubmittingVoucher(false);
    }
  };

  const handleDeleteVoucher = async (id: string, code: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa voucher "${code}" không?`)) return;
    try {
      await api.delete(`/voucher/${id}`);
      toast.success(`Đã xóa voucher ${code}`);
      fetchVouchers();
    } catch (error: any) {
      toast.error('Không thể xóa voucher');
    }
  };

  // ----- Movies CRUD -----
  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMovie) {
        await api.put(`/movies/${editingMovie.id}`, {
          ...newMovie,
          duration: Number(newMovie.duration)
        });
        toast.success('Cập nhật phim thành công');
        setEditingMovie(null);
      } else {
        await api.post('/movies', {
          ...newMovie,
          duration: Number(newMovie.duration)
        });
        toast.success('Thêm phim thành công');
      }
      setNewMovie({ title: '', description: '', duration: '', release_date: '', poster_url: '' });
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
      release_date: movie.release_date ? movie.release_date.substring(0, 10) : '',
      poster_url: movie.poster_url || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
    setNewMovie({ title: '', description: '', duration: '', release_date: '' });
  };

  const handleDeleteMovie = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phim này?')) return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Đã xóa phim');
      setMovies(movies.filter(m => m.id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi khi xóa phim');
    }
  };

  return (
    <div className="page-container p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="page-title !text-3xl md:!text-5xl border-l-[6px] border-[var(--accent-blue)] pl-4 drop-shadow-[0_0_10px_var(--accent-glow)]">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-900/40 p-2 rounded-2xl w-max border border-[var(--border-card)]">
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={activeTab === 'REPORTS' ? 'btn-tab-active' : 'btn-tab'}
          >
            Báo Cáo Doanh Thu
          </button>
          <button
            onClick={() => setActiveTab('MOVIES')}
            className={activeTab === 'MOVIES' ? 'btn-tab-active' : 'btn-tab'}
          >
            Quản Lý Phim
          </button>
          <button
            onClick={() => setActiveTab('SHOWTIMES')}
            className={activeTab === 'SHOWTIMES' ? 'btn-tab-active' : 'btn-tab'}
          >
            Lên Lịch Chiếu
          </button>
          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={activeTab === 'BOOKINGS' ? 'btn-tab-active' : 'btn-tab'}
          >
            Quản Lý Vé Bán
          </button>
          <button
            onClick={() => setActiveTab('VOUCHERS')}
            className={activeTab === 'VOUCHERS' ? 'btn-tab-active' : 'btn-tab'}
          >
            Quản Lý Voucher
          </button>
        </div>

        {/* TAB REPORTS */}
        {activeTab === 'REPORTS' && (
          <div className="card-container animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">📊</span>
              Thống Kê Tổng Quan
            </h2>
            {isLoadingReports ? (
              <div className="flex justify-center p-16">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-[var(--accent-blue)] transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
                  <span className="text-gray-400 font-bold mb-3 uppercase tracking-widest text-sm z-10">Tổng Doanh Thu</span>
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 drop-shadow-md z-10">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(reportData?.revenue || 0)}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-[var(--accent-blue)] transition-colors">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--accent-blue)]/10 rounded-full blur-3xl group-hover:bg-[var(--accent-blue)]/20 transition-all"></div>
                  <span className="text-gray-400 font-bold mb-3 uppercase tracking-widest text-sm z-10">Vé Đã Bán</span>
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-blue)] to-cyan-300 drop-shadow-md z-10">
                    {reportData?.total_tickets || 0} <span className="text-xl text-gray-500 font-medium">vé</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB MOVIES */}
        {activeTab === 'MOVIES' && (
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
        )}

        {/* TAB SHOWTIMES */}
        {activeTab === 'SHOWTIMES' && (
          <div className="animate-fade-in-up space-y-8">
            <div className="card-container !bg-gray-900/40">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)] text-white">📅</span>
                Lên Lịch Chiếu Mới
              </h2>
              <form onSubmit={handleAddShowtime} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="input-label">Bộ Phim</label>
                  <select
                    required
                    value={newShowtime.movie_id}
                    onChange={(e) => setNewShowtime({...newShowtime, movie_id: e.target.value})}
                    className="input-field text-gray-300"
                  >
                    <option value="">-- Chọn phim --</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Phòng Chiếu</label>
                  <select
                    required
                    value={newShowtime.room_id}
                    onChange={(e) => setNewShowtime({...newShowtime, room_id: e.target.value})}
                    className="input-field text-gray-300"
                  >
                    <option value="">-- Chọn phòng --</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name} - {r.total_seats} ghế</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    required
                    value={newShowtime.start_time}
                    onChange={(e) => setNewShowtime({...newShowtime, start_time: e.target.value})}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="input-label">Giá vé cơ bản (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={newShowtime.price}
                    onChange={(e) => setNewShowtime({...newShowtime, price: Number(e.target.value)})}
                    className="input-field"
                    placeholder="VD: 65000"
                  />
                </div>
                <div className="lg:col-span-4 flex justify-end pt-4 border-t border-[var(--border-card)]">
                  <button
                    type="submit"
                    disabled={isSubmittingShowtime}
                    className="btn-success min-w-[200px]"
                  >
                    {isSubmittingShowtime ? <div className="spinner-small mr-2"></div> : null}
                    {isSubmittingShowtime ? 'Đang Xử Lý' : 'Tạo Suất Chiếu'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-container !p-0 overflow-hidden">
              <div className="p-6 border-b border-[var(--border-card)]">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white">🗓️</span>
                  Danh Sách Các Suất Chiếu Đã Lên Lịch
                </h2>
              </div>
              {isLoadingShowtimes ? (
                <div className="flex justify-center py-16"><div className="spinner"></div></div>
              ) : showtimes.length === 0 ? (
                <div className="text-center py-16 text-gray-500">Chưa có lịch chiếu nào.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-gray-400 uppercase text-xs tracking-widest font-semibold">
                        <th className="p-5 border-b border-[var(--border-card)]">Thời Gian</th>
                        <th className="p-5 border-b border-[var(--border-card)]">Phim</th>
                        <th className="p-5 border-b border-[var(--border-card)]">Phòng</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-right">Giá Vé</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-card)] text-gray-300">
                      {showtimes.map(st => (
                        <tr key={st.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-5">
                            <span className="font-bold text-[var(--accent-blue)]">
                              {new Date(st.start_time).toLocaleDateString('vi-VN')}
                            </span>
                            <br/>
                            <span className="text-lg text-white font-black drop-shadow-md">
                              {new Date(st.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit'})}
                            </span>
                          </td>
                          <td className="p-5 font-bold text-white">{st.movie?.title}</td>
                          <td className="p-5 text-indigo-400 font-semibold">{st.room?.name}</td>
                          <td className="p-5 text-right font-bold text-green-400">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(st.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB VOUCHERS */}
        {activeTab === 'VOUCHERS' && (
          <div className="animate-fade-in-up space-y-8">
            <div className="card-container !bg-gray-900/40">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-green-500 flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">💸</span>
                Tạo Voucher Mới
              </h2>
              <form onSubmit={handleAddVoucher} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="input-label">Mã Giảm Giá (Code)</label>
                  <input
                    type="text"
                    required
                    value={newVoucher.code}
                    onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                    className="input-field"
                    placeholder="VD: MAGIAMGIA50"
                  />
                </div>
                <div>
                  <label className="input-label">Phần trăm giảm (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="1"
                    required
                    value={newVoucher.discount}
                    onChange={(e) => setNewVoucher({...newVoucher, discount: e.target.value})}
                    className="input-field"
                    placeholder="VD: 50"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end pt-4 border-t border-[var(--border-card)]">
                  <button
                    type="submit"
                    disabled={isSubmittingVoucher}
                    className="btn-success min-w-[200px]"
                  >
                    {isSubmittingVoucher ? <div className="spinner-small mr-2"></div> : null}
                    {isSubmittingVoucher ? 'Đang Xử Lý' : 'Tạo Voucher'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-container !p-0 overflow-hidden mt-8">
              <div className="p-6 md:p-8 border-b border-[var(--border-card)] flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg">📋</span>
                  Danh Sách Voucher
                </h2>
                <span className="text-gray-400 text-sm font-medium">{vouchers.length} mã</span>
              </div>
              {isLoadingVouchers ? (
                <div className="flex justify-center py-16"><div className="spinner"></div></div>
              ) : vouchers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">Chưa có voucher nào.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-gray-400 uppercase text-xs tracking-widest font-semibold">
                        <th className="p-5 border-b border-[var(--border-card)]">Mã Voucher (CODE)</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Giảm giá (%)</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Trạng thái</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-card)] text-gray-300">
                      {vouchers.map(v => (
                        <tr key={v.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-5">
                            <span className="font-mono text-lg font-bold text-[var(--accent-blue)] bg-blue-900/30 px-3 py-1 rounded-md border border-[var(--accent-blue)]">
                              {v.code}
                            </span>
                          </td>
                          <td className="p-5 text-center font-bold text-green-400 text-xl">{v.discount}%</td>
                          <td className="p-5 text-center">
                            {v.is_active ? 
                              <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-sm">Khả dụng</span> : 
                              <span className="text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-sm">Hết hạn</span>
                            }
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => handleDeleteVoucher(v.id, v.code)}
                              className="btn-danger !py-1.5 !px-4 text-sm"
                            >
                              🗑️ Xóa
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
        )}

        {/* TAB BOOKINGS */}
        {activeTab === 'BOOKINGS' && (
          <div className="animate-fade-in-up">
            <div className="card-container !p-0 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[var(--border-card)] flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">🎫</span>
                  Danh Sách Vé Đã Bán
                </h2>
                <span className="text-gray-400 text-sm font-medium">{allBookings.length} vé</span>
              </div>
              {isLoadingBookings ? (
                <div className="flex justify-center py-16">
                  <div className="spinner"></div>
                </div>
              ) : allBookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500">Chưa có vé nào được bán.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-gray-400 uppercase text-xs tracking-widest font-semibold">
                        <th className="p-4 border-b border-[var(--border-card)]">Mã Vé</th>
                        <th className="p-4 border-b border-[var(--border-card)]">Phim</th>
                        <th className="p-4 border-b border-[var(--border-card)]">Phòng</th>
                        <th className="p-4 border-b border-[var(--border-card)]">Ghế</th>
                        <th className="p-4 border-b border-[var(--border-card)]">Khách hàng</th>
                        <th className="p-4 border-b border-[var(--border-card)]">Tổng tiền</th>
                        <th className="p-4 border-b border-[var(--border-card)]">Ngày đặt</th>
                        <th className="p-4 border-b border-[var(--border-card)] text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-card)] text-gray-300">
                      {allBookings.map(b => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-xs text-gray-500">...{b.id.substring(b.id.length - 8)}</td>
                          <td className="p-4 font-bold text-white">{b.showtime?.movie?.title || 'N/A'}</td>
                          <td className="p-4 text-blue-400 font-semibold text-sm">{b.showtime?.room?.name || 'N/A'}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {b.booking_seats && b.booking_seats.length > 0
                                ? b.booking_seats.map((bs, i) => (
                                    <span key={i} className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs font-bold">{bs.seat.seat_number}</span>
                                  ))
                                : <span className="text-gray-600 text-xs">—</span>
                              }
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-white font-medium">{b.user?.full_name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{b.user?.email || ''}</p>
                          </td>
                          <td className="p-4 font-bold text-green-400">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.total_price)}
                          </td>
                          <td className="p-4 text-gray-400 text-sm">{new Date(b.created_at).toLocaleString('vi-VN')}</td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${
                              b.status === 'USED'
                                ? 'bg-gray-800 text-gray-500 border-gray-700'
                                : b.status === 'PENDING'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                : 'bg-green-500/10 text-green-400 border-green-500/30'
                            }`}>
                              {b.status === 'USED' ? 'Đã dùng' : b.status === 'PENDING' ? 'Chờ TT' : b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

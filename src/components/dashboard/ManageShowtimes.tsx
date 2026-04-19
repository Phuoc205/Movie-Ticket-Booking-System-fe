import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ShowtimeAdmin {
  id: string;
  start_time: string;
  end_time: string;
  price: string;
  movie: { title: string };
  room: { name: string };
}

interface Movie {
  id: string;
  title: string;
}

interface Room {
  id: string;
  name: string;
  total_seats: number;
}

const ManageShowtimes = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showtimes, setShowtimes] = useState<ShowtimeAdmin[]>([]);
    const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
    const [newShowtime, setNewShowtime] = useState({ movie_id: '', room_id: '', start_time: '', price: ''});
    const [isSubmittingShowtime, setIsSubmittingShowtime] = useState(false);
    const [editingShowtime, setEditingShowtime] = useState<any | null>(null);


    const fetch = async () => {
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

    const handleEditShowtime = (st: ShowtimeAdmin) => {
        setEditingShowtime(st);
        setNewShowtime({
            movie_id: (st as any).movie_id || '',
            room_id: (st as any).room_id || '',
            start_time: st.start_time.slice(0, 16),
            price: (st as any).price || ''
        });
    };

    const handleDeleteShowtime = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa suất chiếu này không?')) return;

        try {
            await api.delete(`/showtimes/${id}`);
            toast.success('Xóa suất chiếu thành công');
            setShowtimes(prev => prev.filter(s => s.id !== id));
        } catch {
            toast.error('Không thể xóa suất chiếu');
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
            const payload = {
                movie_id: newShowtime.movie_id,
                room_id: newShowtime.room_id,
                start_time: newShowtime.start_time,
                price: Number(newShowtime.price)
            };

            if (editingShowtime) {
                await api.patch(`/showtimes/${editingShowtime.id}`, payload);
                toast.success('Cập nhật lịch chiếu thành công');
                setEditingShowtime(null);
            } else {
                await api.post('/showtimes', payload);
                toast.success('Tạo lịch chiếu thành công');
            }

            setNewShowtime({ movie_id: '', room_id: '', start_time: '', price: ''});
            fetch();
        } catch {
            toast.error('Có lỗi khi xử lý lịch chiếu');
        } finally {
            setIsSubmittingShowtime(false);
        }
    };

    const handleResetShowtime = async (showtimeId: string) => {
        if (!window.confirm("Reset toàn bộ ghế của suất chiếu này?")) return;

        try {
            await api.post(`/showtimes/${showtimeId}/reset`);
            toast.success("Reset ghế thành công");
        } catch (err) {
            toast.error("Reset thất bại");
        }
    };

    useEffect(() => {
        fetch();
        api.get('/movies').then(res => setMovies(res.data));
        api.get('/rooms').then(res => setRooms(res.data));
    }, []);

    return (
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
                <label className="input-label">Giá vé (VND)</label>
                <input
                    type="number"
                    required
                    value={newShowtime.price}
                    onChange={(e) =>
                    setNewShowtime({ ...newShowtime, price: e.target.value })
                    }
                    className="input-field"
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
                    <th className="p-5 border-b border-[var(--border-card)]">Giá</th>
                    <th className="p-5 border-b border-[var(--border-card)] text-center">Hành động</th>
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
                        <td className="p-5 text-green-400 font-bold">
                            {st.price?.toLocaleString()} VND
                        </td>
                        <td className="p-5 text-center flex justify-center gap-2">
                            <button
                                onClick={() => handleEditShowtime(st)}
                                className="btn-primary !py-1 !px-3 text-sm"
                            >
                                Sửa
                            </button>

                            <button
                                onClick={() => handleDeleteShowtime(st.id)}
                                className="btn-danger !py-1 !px-3 text-sm"
                            >
                                Xóa
                            </button>

                            <button
                                onClick={() => handleResetShowtime(st.id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-sm font-bold"
                            >
                                Reset ghế
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

export default ManageShowtimes;
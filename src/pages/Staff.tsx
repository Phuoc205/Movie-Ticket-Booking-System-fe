import React, { useState, useEffect } from 'react';
import './css/Staff.css';
import toast from 'react-hot-toast';
import api from '../services/api';

interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  total_price: number;
  status: string;
  created_at: string;
  showtime?: {
    movie: { title: string };
    room: { name: string };
  };
  booking_seats?: {
    seat: { seat_number: string };
  }[];
}

interface BookingListItem {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  showtime?: {
    movie: { title: string };
    room: { name: string };
  };
  booking_seats?: {
    seat: { seat_number: string };
  }[];
}

const Staff: React.FC = () => {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allBookings, setAllBookings] = useState<BookingListItem[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);

  const fetchAllBookings = async () => {
    setIsLoadingAll(true);
    try {
      const response = await api.get('/bookings/all-history');
      setAllBookings(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách vé');
    } finally {
      setIsLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) return;

    setIsLoading(true);
    setBooking(null);
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data);
      toast.success('Tìm thấy thông tin vé!');
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Không tìm thấy vé với ID này');
      } else {
        toast.error('Có lỗi xảy ra khi tìm vé');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = () => {
    // Thường staff sẽ gọi 1 API update status thành COMPLETED/USED.
    // Ở đây giả lập hiển thị success vì đề bài chưa yêu cầu API Check-in cụ thể.
    toast.success(`Đã check-in thành công cho vé #${booking?.id}`);
    setBooking(prev => prev ? { ...prev, status: 'USED' } : null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-4xl mt-10">
        
        <div className="text-center mb-10">
          <h1 className="page-title text-4xl mb-3">🎫 Staff Portal</h1>
          <p className="text-gray-400 text-lg tracking-wide">Hệ thống kiểm tra và soát vé khách hàng</p>
        </div>

        {/* Search Bar */}
        <div className="card-container mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label className="input-label">Mã Số Vé (Booking ID)</label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Nhập mã đặt vé của khách..."
                className="input-field !text-lg !font-mono !tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full md:w-auto h-[60px]"
            >
              {isLoading ? <div className="spinner-small mr-2"></div> : null}
              {isLoading ? 'Đang Xử Lý...' : 'Tra Cứu Vé'}
            </button>
          </form>
        </div>

        {/* Results */}
        {booking && (
          <div className="card-container animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-[var(--border-card)] pb-6 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">🎟</span>
                Chi Tiết Vé
                <span className="text-gray-500 font-mono text-sm tracking-wider uppercase ml-2 px-3 py-1 bg-gray-900 rounded-full border border-gray-800">
                  ...{booking.id.substring(Math.max(0, booking.id.length - 8))}
                </span>
              </h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${
                booking.status === 'USED' 
                  ? 'bg-gray-800 text-gray-500 border-gray-700'
                  : 'bg-green-500/10 text-green-400 border-green-500/30 drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]'
              }`}>
                {booking.status === 'USED' ? 'Đã Check-in' : 'Hợp Lệ'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-card)]">
                <p className="input-label mb-2">Thanh Toán</p>
                <p className="text-3xl font-black text-[var(--accent-blue)] drop-shadow-[0_0_8px_var(--accent-glow)] mb-2">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_price)}
                </p>
                <p className="text-gray-500 text-sm font-medium">
                  Thời gian: {new Date(booking.created_at).toLocaleString('vi-VN')}
                </p>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-[var(--border-card)]">
                <p className="input-label mb-3">Phim & Ghế Khách Đặt</p>
                {booking.showtime && (
                  <div className="mb-4">
                    <p className="text-xl font-bold text-white leading-tight">{booking.showtime.movie.title}</p>
                    <p className="text-sm text-blue-400 font-semibold">{booking.showtime.room.name}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {booking.booking_seats && booking.booking_seats.length > 0 ? (
                    booking.booking_seats.map((bs, idx) => (
                      <span key={idx} className="bg-[var(--accent-blue)] text-white px-3 py-1.5 rounded-lg font-bold shadow-md">
                        {bs.seat.seat_number}
                      </span>
                    ))
                  ) : (
                     <span className="text-gray-500 italic">Không có dữ liệu ghế...</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 mt-4 border-t border-[var(--border-card)]">
              {booking.status === 'USED' ? (
                <div className="w-full text-center py-4 bg-gray-800/50 text-gray-500 font-bold rounded-xl border border-gray-700">
                  Vé Đã Được Sử Dụng Trước Đó
                </div>
              ) : (
                <button
                  onClick={handleCheckIn}
                  className="btn-success w-full h-[60px] text-xl tracking-wide uppercase"
                >
                  Xác Nhận Soát Vé Nhập Rạp
                </button>
              )}
            </div>
          </div>
        )}

        {/* Danh sách vé đã bán */}
        <div className="card-container !p-0 overflow-hidden mt-8">
          <div className="p-6 border-b border-[var(--border-card)] flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">🎫</span>
              Danh Sách Vé Đã Bán
            </h2>
            <button onClick={fetchAllBookings} className="btn-tab text-sm">Tải lại</button>
          </div>
          {isLoadingAll ? (
            <div className="flex justify-center py-12"><div className="spinner"></div></div>
          ) : allBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Chưa có vé nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-gray-400 uppercase text-xs tracking-widest font-semibold">
                    <th className="p-4 border-b border-[var(--border-card)]">Mã Vé</th>
                    <th className="p-4 border-b border-[var(--border-card)]">Phim</th>
                    <th className="p-4 border-b border-[var(--border-card)]">Phòng</th>
                    <th className="p-4 border-b border-[var(--border-card)]">Ghế</th>
                    <th className="p-4 border-b border-[var(--border-card)]">Tổng tiền</th>
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
                      <td className="p-4 font-bold text-green-400">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(b.total_price)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                          b.status === 'USED'
                            ? 'bg-gray-800 text-gray-500 border-gray-700'
                            : 'bg-green-500/10 text-green-400 border-green-500/30'
                        }`}>
                          {b.status === 'USED' ? 'Đã dùng' : b.status}
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
    </div>
  );
};

export default Staff;

import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

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

const ManageBookingTickets = () => {
    const [allBookings, setAllBookings] = useState<BookingAdmin[]>([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);

    const fetch = async () => {
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
    
    useEffect(() => {
        fetch();
    }, []);

    return (
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
        )
};

export default ManageBookingTickets;
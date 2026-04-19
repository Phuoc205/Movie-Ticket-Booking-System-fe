import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

interface BookingHistoryItem {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  showtime?: {
    start_time: string;
    movie: { title: string };
    room: { name: string };
  };
  booking_seats?: {
    seat: { seat_number: string };
  }[];
}

const History: React.FC = () => {
  const auth = useContext(AuthContext);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth?.user?.id) return;
      setIsLoading(true);
      try {
        const response = await api.get('/bookings/history', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        toast.error('Không thể tải lịch sử đặt vé');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [auth?.user?.id]);


  const refund = async (id: string) => {
    const confirm = window.confirm("Bạn chắc chắn muốn hoàn vé?");
    if (!confirm) return;

    try {
      await api.post(`/bookings/${id}/refund`, {}, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      toast.success("Hoàn vé thành công");

      // update UI
      setBookings(prev =>
        prev.map(b =>
          b.id === id ? { ...b, status: "REFUNDED" } : b
        )
      );

    } catch (e: any) {
      toast.error(e.response?.data?.message || "Lỗi hoàn vé");
    }
  };

  return (
    <div className="page-container p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title !text-3xl md:!text-5xl border-l-[6px] border-purple-500 pl-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] mb-10">
          🎟️ Lịch Sử Đặt Vé
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card-container text-center py-16">
            <p className="text-5xl mb-4">🍿</p>
            <p className="text-gray-400 text-lg">Bạn chưa đặt vé nào. Hãy chọn một bộ phim yêu thích!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const seatList = booking.booking_seats?.map(bs => bs.seat.seat_number).join(', ') || 'N/A';
              const movieTitle = booking.showtime?.movie?.title || 'Không rõ phim';
              const roomName = booking.showtime?.room?.name || '';
              const showDate = booking.showtime?.start_time
                ? new Date(booking.showtime.start_time).toLocaleString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                : '';
              const isUsed = booking.status === 'USED';
              const isRefunded = booking.status === 'REFUNDED';

              const canRefund =
                booking.status === 'CONFIRMED' &&
                booking.showtime?.start_time &&
                new Date(booking.showtime.start_time).getTime() - Date.now() > 60 * 60 * 1000;

              return (
                <div
                  key={booking.id}
                  className={`card-container !p-0 overflow-hidden transition-all hover:shadow-xl ${isUsed ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left - Movie Info */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{movieTitle}</h3>
                          <p className="text-blue-400 font-semibold text-sm mt-1">{roomName}</p>
                        </div>
                        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase border ${
                          isUsed
                            ? 'bg-gray-800 text-gray-500 border-gray-700'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                            : 'bg-green-500/10 text-green-400 border-green-500/30'
                        }`}>
                          {isRefunded
                            ? 'Đã hoàn'
                            : isUsed
                            ? 'Đã dùng'
                            : booking.status === 'PENDING'
                            ? 'Chờ TT'
                            : 'Thành công'}
                        </span>
                      </div>

                      {/* Date & Seats */}
                      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
                        {showDate && (
                          <div>
                            <span className="text-gray-500 uppercase tracking-widest text-xs font-semibold block mb-1">Suất chiếu</span>
                            <span className="text-gray-200 font-medium">{showDate}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500 uppercase tracking-widest text-xs font-semibold block mb-1">Ghế</span>
                          <span className="text-gray-200 font-medium">{seatList}</span>
                        </div>
                      </div>

                      {/* REFUND BUTTON */}
                      {canRefund && (
                        <button
                          onClick={() => refund(booking.id)}
                          className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
                        >
                          Hoàn vé
                        </button>
                      )}
                    </div>

                    {/* Right - Price & ID */}
                    <div className="md:w-56 bg-gray-900/60 border-t md:border-t-0 md:border-l border-[var(--border-card)] p-6 md:p-8 flex flex-col items-center justify-center text-center">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Tổng tiền</p>
                      <p className="text-2xl font-black text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] mb-4">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.total_price)}
                      </p>
                      <p className="text-gray-600 text-[10px] font-mono break-all leading-relaxed">
                        {booking.id}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface BookingHistoryItem {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
  };
  showtime?: {
    start_time: string;
    movie: { title: string };
    room: { name: string };
  };
  booking_seats?: {
    seat: { seat_number: string };
  }[];
}

const ManageHistory: React.FC = () => {
  const auth = useContext(AuthContext);
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchManageHistory = async () => {
      if (!auth?.token) return;

      setIsLoading(true);
      try {
        const res = await api.get('/bookings/all-history', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        setBookings(res.data);
      } catch (err) {
        toast.error('Không thể tải lịch sử toàn hệ thống');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManageHistory();
  }, [auth?.token]);

  return (
    <div className="page-container p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8 border-l-4 border-red-500 pl-4">
          📊 Lịch sử toàn hệ thống
        </h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : bookings.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <div className="space-y-6">

            {bookings.map((b) => {
              const seats = b.booking_seats
                ?.map(x => x.seat.seat_number)
                .join(', ');

              return (
                <div key={b.id} className="card-container p-4">

                  {/* USER INFO */}
                  <div className="mb-2 text-sm text-gray-400">
                    👤 {b.user?.full_name} ({b.user?.email})
                  </div>

                  {/* MOVIE */}
                  <div className="text-lg font-bold">
                    {b.showtime?.movie?.title}
                  </div>

                  <div className="text-sm text-gray-300">
                    🏢 {b.showtime?.room?.name}
                  </div>

                  {/* SEATS */}
                  <div className="text-sm mt-1">
                    🎟 Ghế: {seats}
                  </div>

                  {/* PRICE */}
                  <div className="mt-2 font-bold text-green-400">
                    {b.total_price.toLocaleString()}đ
                  </div>

                  {/* STATUS */}
                  <div className="text-xs mt-1">
                    Status: {b.status}
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

export default ManageHistory;
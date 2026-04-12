import React, { useState, useEffect, useContext } from 'react';
import './css/MovieDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

interface Showtime {
  id: string;
  start_time: string;
  end_time: string;
  price?: number;
  room_id?: string;
  movie_id?: string;
  room?: {
    id: string;
    name: string;
  };
}

interface Movie {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  duration: number;
  release_date: string;
  genre: string;
  showtimes: Showtime[];
}

interface Seat {
  id: string;
  seat_number: string;
  is_booked: boolean;
  type: string;
  price: number;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Booking Flow
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedTicketId, setBookedTicketId] = useState<string | null>(null);

  // States for Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ id: string, code: string, discount: number } | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const basePrice = selectedSeats.reduce((sum, seat) => {
    let seatPrice = selectedShowtime?.price || 65000;
    if (seat.type === 'VIP') seatPrice += 35000; // VIP fee
    return sum + seatPrice;
  }, 0);
  
  const discountAmount = appliedVoucher ? (basePrice * appliedVoucher.discount) / 100 : 0;
  const finalPrice = basePrice - discountAmount;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        toast.error('Không thể tải thông tin phim. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  const handleSelectShowtime = async (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]); // Reset local state
    
    // Yêu cầu đăng nhập trước khi chọn ghế
    if (!authContext?.isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt vé');
      navigate('/login');
      return;
    }

    setIsLoadingSeats(true);
    try {
      const roomId = showtime.room?.id || showtime.room_id;
      // Backend có thể yêu cầu showtime_id để check ghế trống theo giờ
      const response = await api.get(`/rooms/${roomId}/seats`, {
        params: { showtime_id: showtime.id }
      });
      setSeats(response.data);
    } catch (error) {
      toast.error('Không thể lấy sơ đồ ghế phòng chiếu.');
    } finally {
      setIsLoadingSeats(false);
    }
  };

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.is_booked) return;
    
    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.find((s) => s.id === seat.id);
      if (isAlreadySelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsApplyingVoucher(true);
    try {
      const response = await api.post('/voucher/validate', { code: voucherCode.toUpperCase() });
      if (response.data.valid) {
        setAppliedVoucher(response.data);
        toast.success(`Áp dụng mã giảm ${response.data.discount}% thành công!`);
        setVoucherCode('');
      } else {
        toast.error(response.data.message || 'Mã không hợp lệ');
        setAppliedVoucher(null);
      }
    } catch (e) {
      toast.error('Có lỗi khi kiểm tra mã voucher');
      setAppliedVoucher(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleBookingAndPayment = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ghế');
      return;
    }

    if (!authContext?.user?.id) {
      toast.error('Vui lòng đăng nhập để đặt vé!');
      navigate('/login');
      return;
    }
    setIsProcessing(true);
    try {
      // 1. Tạo Booking
      const bookingResponse = await api.post('/bookings', {
        user_id: authContext?.user?.id,
        showtime_id: selectedShowtime?.id,
        seat_ids: selectedSeats.map((s) => s.id),
        total_price: finalPrice
      });
      
      const bookingId = bookingResponse.data.id || bookingResponse.data.booking_id;
      
      // 2. Thanh toán Booking
      await api.post('/payments', {
        booking_id: bookingId,
        amount: finalPrice
      });

      toast.success('Đặt vé và thanh toán thành công!');
      
      // Update lại ghế đã chọn thành dạng booked ngay lập tức trên UI hoặc fetch lại ghế
      setSeats(prev => prev.map(seat => 
        selectedSeats.find(s => s.id === seat.id) ? { ...seat, is_booked: true } : seat
      ));
      setSelectedSeats([]);
      setBookedTicketId(bookingId);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi khi đặt vé hoặc thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-container flex justify-center items-center h-screen">
        <h2 className="text-2xl">Phim không tồn tại!</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Movie Details Hero */}
      <div className="movie-details-hero p-6 md:p-12 mb-16 relative">
        {movie.poster_url && (
          <div className="movie-details-backdrop" style={{ backgroundImage: `url(${movie.poster_url})` }}></div>
        )}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            {movie.poster_url ? (
              <img src={movie.poster_url} alt={movie.title} className="w-full rounded-2xl shadow-2xl border border-[var(--border-card)]" />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500 border border-[var(--border-card)]">No Image</div>
            )}
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-center py-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">{movie.title}</h1>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="movie-genre-badge">{movie.genre}</span>
              <span className="movie-badge">⏳ {movie.duration} phút</span>
              <span className="movie-badge">📅 {new Date(movie.release_date).toLocaleDateString('vi-VN')}</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl font-light">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pb-32">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-4">Lịch Điển Vui Lòng Chọn</h2>
        
        {(!movie.showtimes || movie.showtimes.length === 0) ? (
          <div className="card-container text-center py-12">
            <p className="text-gray-400 text-lg">Phim này hiện tại chưa có lịch chiếu.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 mb-12">
            {movie.showtimes.map((st) => {
              const startDate = new Date(st.start_time);
              const isSelected = selectedShowtime?.id === st.id;
              
              return (
                <button
                  key={st.id}
                  onClick={() => handleSelectShowtime(st)}
                  className={`showtime-btn ${isSelected ? 'showtime-btn-active' : 'showtime-btn-idle'}`}
                >
                  <span className="text-sm font-medium opacity-80">{startDate.toLocaleDateString('vi-VN')}</span>
                  <span className="text-2xl font-black tracking-tight">
                    {startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs uppercase tracking-widest font-semibold mt-1">
                    {st.room ? st.room.name : `Phòng ${st.room_id}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Seat Selection */}
        {selectedShowtime && (
          <div className="card-container mt-8 relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-12 text-center drop-shadow-md">
              Sơ đồ ghế - {selectedShowtime.room ? selectedShowtime.room.name : `Phòng ${selectedShowtime.room_id}`}
            </h3>
            
            {isLoadingSeats ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                <div className="mb-12">
                  <div className="cinema-screen">
                    <span className="text-[var(--accent-blue)] text-sm font-bold uppercase tracking-[0.5em] drop-shadow-[0_0_5px_var(--accent-glow)]">Màn Hình</span>
                  </div>
                  
                  {/* Grid Ghế */}
                  <div className="flex justify-center flex-col items-center gap-6">
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 md:gap-4 p-4 md:p-8 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm">
                      {seats.map((seat) => {
                        const isSelected = selectedSeats.some((s) => s.id === seat.id);
                        
                        let seatClass = "seat ";
                        if (seat.is_booked) seatClass += "seat-booked";
                        else if (isSelected) seatClass += "seat-selected";
                        else seatClass += "seat-available";

                        const seatPrice = selectedShowtime?.price ? 
                          (seat.type === 'VIP' ? selectedShowtime.price + 35000 : selectedShowtime.price) 
                          : seat.price;
                          
                        return (
                          <button
                            key={seat.id}
                            disabled={seat.is_booked}
                            onClick={() => toggleSeatSelection(seat)}
                            className={seatClass}
                            title={`Ghế ${seat.seat_number} - ${seatPrice} ${seat.type === 'VIP' ? '(VIP)' : ''} ${seat.is_booked ? '(Đã đặt)' : ''}`}
                          >
                            {seat.seat_number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Seat Legend */}
                <div className="flex justify-center flex-wrap gap-8 mb-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <div className="seat seat-available w-8 h-8 rounded-md text-[0px]"></div>
                    <span className="text-gray-300">Còn trống</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="seat seat-selected w-8 h-8 rounded-md text-[0px]"></div>
                    <span className="text-gray-300">Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="seat seat-booked w-8 h-8 rounded-md text-[0px]"></div>
                    <span className="text-gray-400">Đã đặt</span>
                  </div>
                </div>

                {/* Booking Summary */}
                {bookedTicketId ? (
                  <div className="card-container text-center mt-12 bg-green-900/20 border-green-500/30 w-full animate-fade-in relative z-20">
                    <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-3xl font-black text-green-400 mb-2">Thanh Toán Thành Công!</h2>
                    <p className="text-gray-300 mb-8 text-lg font-light">Cảm ơn bạn đã đặt vé. Hãy đưa mã này cho nhân viên soát vé.</p>
                    <div className="inline-block bg-gray-900 border border-gray-700 px-8 py-6 rounded-2xl shadow-xl">
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">MÃ VÉ CỦA BẠN (BOOKING ID)</p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl text-white font-mono font-medium tracking-[0.1em] break-all">{bookedTicketId}</p>
                    </div>
                    <div className="mt-8">
                       <button onClick={() => setBookedTicketId(null)} className="btn-tab text-white bg-gray-700/50 hover:bg-gray-600 transition-colors">Đóng & Chọn thêm ghế</button>
                    </div>
                  </div>
                ) : (
                  selectedSeats.length > 0 && (
                    <div className="booking-summary-bar relative z-20 flex-col md:flex-row items-center !p-6 md:!p-4">
                      <div className="flex-1 w-full mb-4 md:mb-0">
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2">Ghế đang giữ</h4>
                        <p className="flex flex-wrap gap-2">
                          {selectedSeats.map(s => (
                            <span key={s.id} className="bg-[var(--accent-glow)] text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                              {s.seat_number}
                            </span>
                          ))}
                        </p>
                      </div>
                      <div className="flex-1 flex flex-col gap-2 w-full md:border-l md:border-r border-[var(--border-card)] md:px-6 mb-4 md:mb-0">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập mã giảm giá..."
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            className="input-field !py-2 !px-3 text-sm flex-1"
                          />
                          <button
                            onClick={handleApplyVoucher}
                            disabled={isApplyingVoucher || !voucherCode.trim()}
                            className="bg-gray-800 text-white font-semibold px-4 rounded-xl hover:bg-gray-700 transition"
                          >
                            {isApplyingVoucher ? '...' : 'Áp dụng'}
                          </button>
                        </div>
                        {appliedVoucher && (
                          <div className="text-green-400 text-xs font-bold bg-green-900/30 px-3 py-1.5 rounded-lg flex justify-between items-center relative">
                            <span>Đã giảm {appliedVoucher.discount}% ({appliedVoucher.code})</span>
                            <button onClick={() => setAppliedVoucher(null)} className="text-gray-400 hover:text-white absolute -top-1 -right-1 bg-black rounded-full w-5 h-5 flex items-center justify-center">×</button>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-right w-full">
                        <h4 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Thành tiền</h4>
                        <p className="text-2xl md:text-3xl text-white font-black drop-shadow-[0_0_8px_var(--accent-glow)]">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
                        </p>
                        {appliedVoucher && (
                          <p className="line-through text-gray-500 text-sm mt-1">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basePrice)}
                          </p>
                        )}
                      </div>
                      <div className="w-full md:w-auto md:ml-6 mt-4 md:mt-0">
                        <button
                          onClick={handleBookingAndPayment}
                          disabled={isProcessing}
                          className="btn-primary py-4 px-8 w-full md:w-auto text-lg whitespace-nowrap"
                        >
                          {isProcessing ? <div className="spinner-small mr-2"></div> : null}
                          {isProcessing ? 'Đang Xử Lý...' : 'Đặt Vé & Thanh Toán'}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;

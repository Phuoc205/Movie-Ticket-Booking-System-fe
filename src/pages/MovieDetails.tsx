import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation  } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovieDetail";
import "./css/MovieDetails.css";
import api from "../services/api";
import SeatSection from "../components/SeatSection";

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const { movie, loading } = useMovieDetail(id);

  const [showTrailer, setShowTrailer] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowTrailer(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (showBooking) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [showBooking]);

  useEffect(() => {
    if (selectedShowtime) {
      fetchSeats(selectedShowtime);
      setSelectedSeats([]); // reset luôn ghế đang chọn
    }
  }, [location.key]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    try {
      const u = new URL(url);
      const videoId = u.searchParams.get("v") || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`;
    } catch {
      return "";
    }
  };

  const handleSelectShowtime = (showtime: any) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
    fetchSeats(showtime);
  };

  const goToPayment = () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      alert("Chọn ghế trước!");
      return;
    }

    navigate("/book-ticket/payment", {
      state: {
        showtime: selectedShowtime,
        seats: selectedSeats,
        movie: movie
      },
    });
  };

  const toggleSeatSelection = (seat: any) => {
    if (seat.is_booked) return;

    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const fetchSeats = async (showtime: any) => {
    if (!showtime) return;

    setIsLoadingSeats(true);
    try {
      const roomId = showtime.room?.id || showtime.room_id;

      const res = await api.get(`/seats/by-room/${roomId}`, {
        params: { showtime_id: showtime.id },
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      setSeats(res.data);
    } catch (err) {
      console.error(err);
      alert("Không tải được ghế");
    } finally {
      setIsLoadingSeats(false);
    }
  };

  const getSeatPrice = () => {
    let price = selectedShowtime.price;

    if (selectedShowtime.room?.type === "VIP") {
      price += 35000;
    }

    return price;
  };

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="movie-details-hero p-6 md:p-12 mb-10 relative">
        {movie.poster_url && (
          <div
            className="movie-details-backdrop"
            style={{ backgroundImage: `url(${movie.poster_url})` }}
          />
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-64 rounded-2xl shadow-xl"
          />

          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="flex gap-3 mt-3 text-sm text-gray-300">
              <span>{movie.genre}</span>
              <span>{movie.duration} phút</span>
              <span>
                {new Date(movie.release_date).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <p className="mt-4 text-gray-300">{movie.description}</p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                🎬 Xem Trailer
              </button>

              <button
                onClick={() => setShowBooking(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                🎟 Xem phim ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TRAILER MODAL */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[80%] aspect-video">
            <iframe
              className="w-full h-full rounded-xl"
              src={getEmbedUrl(movie.trailer_url)}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setShowTrailer(false)}
          />
        </div>
      )}

      {showBooking && (
        <div className="max-w-7xl mx-auto px-4 mt-8 pb-32 animate-fade-in">
          
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-4">
            Chọn suất chiếu
          </h2>

          {(!movie.showtimes || movie.showtimes.length === 0) ? (
            <div className="card-container text-center py-12">
              <p className="text-gray-400 text-lg">
                Phim này hiện tại chưa có lịch chiếu.
              </p>
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
                    className={`showtime-btn ${
                      isSelected ? "showtime-btn-active" : "showtime-btn-idle"
                    }`}
                  >
                    <span className="text-sm opacity-80">
                      {startDate.toLocaleDateString("vi-VN")}
                    </span>

                    <span className="text-2xl font-black">
                      {startDate.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <span className="text-xs">
                      {st.room?.name || `Phòng ${st.room_id}`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* SEAT GRID giữ nguyên code cũ của bạn */}
          {selectedShowtime && (
            <SeatSection
              seats={seats}
              selectedSeats={selectedSeats}
              onToggle={toggleSeatSelection}
              isLoading={isLoadingSeats}
              seatsPerRow={selectedShowtime.room?.seats_per_row || 10}
            />
          )}

          {selectedSeats.length > 0 && selectedShowtime && (
            <div className="mt-8 p-6 bg-black/30 rounded-2xl text-center">
              
              <h3 className="text-xl font-bold mb-4">
                Thông tin đặt vé
              </h3>

              <p className="text-gray-300 mb-2">
                Ghế: {selectedSeats.map(s => s.seat_number).join(", ")}
              </p>

              <p className="text-2xl font-bold text-green-400 mb-6">
                Tổng tiền: {(selectedSeats.length * getSeatPrice()).toLocaleString()}đ
              </p>

              <button
                onClick={goToPayment}
                className="bg-green-600 px-6 py-3 rounded-xl font-bold"
              >
                Thanh toán
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
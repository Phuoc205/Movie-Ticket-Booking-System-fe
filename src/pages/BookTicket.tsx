import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function BookTicket() {
  const navigate = useNavigate();

  return (
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
        );
}
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function BookTicket() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Book Ticket</h1>
      <button onClick={() => navigate("/book-ticket/showtimes")}>
        Chọn suất chiếu
      </button>
    </div>
  );
}
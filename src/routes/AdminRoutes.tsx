import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import BookTicket from "../pages/BookTicket";
import ViewShowtime from "../pages/ViewShowtimes";
import SelectSeats from "../pages/SelectSeat";
import MakePayment from "../pages/MakePayment";

export default function AdminRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chính */}
        <Route path="/" element={<Navigate to="/book-ticket" />} />

        {/* Flow đặt vé */}
        <Route path="/book-ticket" element={<BookTicket />} />
        <Route path="/book-ticket/showtimes" element={<ViewShowtime />} />
        <Route path="/book-ticket/seats" element={<SelectSeats />} />
        <Route path="/book-ticket/payment" element={<MakePayment />} />

        {/* fallback */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
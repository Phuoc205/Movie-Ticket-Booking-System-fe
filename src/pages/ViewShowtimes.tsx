import { useNavigate } from "react-router-dom";

export default function ViewShowtime() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>View Showtime</h1>
      <button onClick={() => navigate("/book-ticket/seats")}>
        Chọn ghế
      </button>
    </div>
  );
}
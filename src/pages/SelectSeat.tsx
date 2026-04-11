import { useNavigate } from "react-router-dom";

export default function SelectSeats() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Select Seats</h1>
      <button onClick={() => navigate("/book-ticket/payment")}>
        Thanh toán
      </button>
    </div>
  );
}
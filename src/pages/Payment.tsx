import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { showtime, seats, movie } = state || {};
  const { token } = useContext(AuthContext)!;

  const [method, setMethod] = useState("momo");
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherId, setVoucherId] = useState<string | null>(null);

  if (!showtime || !seats) {
    return <div>Không có dữ liệu thanh toán</div>;
  }

  const subtotal = seats.length * showtime.price;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handlePayment = async () => {
    if (!token) {
      alert("Bạn cần đăng nhập trước");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/bookings",
        {
          showtimeId: showtime.id,
          seatIds: seats.map((s: any) => s.id),
          payment_method: method,
          voucher_id: voucherId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thanh toán thành công!");
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  const applyVoucher = async () => {
    try {
      const res = await api.get(`/vouchers/code/${voucherCode}`);

      setDiscount(res.data.discount);
      setVoucherId(res.data.id);

      alert("Áp mã thành công");
    } catch {
      alert("Voucher không hợp lệ");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

      {/* INFO */}
      <div className="bg-black/30 p-4 rounded-xl mb-6">
        <p>Phim: {movie?.title}</p>
        <p>Phòng: {showtime.room?.name}</p>
        <p>
          Ghế: {seats.map((s: any) => s.seat_number).join(", ")}
        </p>
        <p className="text-xl text-green-400 font-bold mt-2">
          Tổng tiền: {total.toLocaleString()}đ
        </p>
      </div>

      {/* PAYMENT METHODS */}
      <div className="mb-6">
        <h3 className="font-bold mb-3">Chọn phương thức</h3>

        <div className="flex gap-4">
          <button
            onClick={() => setMethod("momo")}
            className={`px-4 py-2 rounded ${
              method === "momo" ? "bg-pink-600" : "bg-gray-700"
            }`}
          >
            MoMo
          </button>

          <button
            onClick={() => setMethod("bank")}
            className={`px-4 py-2 rounded ${
              method === "bank" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Ngân hàng
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Voucher</h3>

        <div className="flex gap-2">
          <input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã voucher"
            className="input-field flex-1"
          />

          <button
            onClick={applyVoucher}
            className="bg-yellow-500 px-4 rounded"
          >
            Áp dụng
          </button>
        </div>

        {discount > 0 && (
          <p className="text-green-400 mt-2">
            Giảm {discount}% (-{discountAmount.toLocaleString()}đ)
          </p>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 py-3 rounded-xl font-bold"
      >
        {loading ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </div>
  );
}
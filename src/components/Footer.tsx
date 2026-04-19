import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-3">
            🎬 Movie Booking
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nền tảng đặt vé xem phim trực tuyến, giúp bạn chọn ghế, suất chiếu
            và thanh toán nhanh chóng.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Điều hướng
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-red-400 transition">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/movies" className="hover:text-red-400 transition">
                Phim đang chiếu
              </Link>
            </li>
            <li>
              <Link to="/bookings/history" className="hover:text-red-400 transition">
                Lịch sử đặt vé
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Hỗ trợ
          </h3>
          <ul className="space-y-2 text-gray-400">
            <li>Điều khoản sử dụng</li>
            <li>Chính sách hoàn vé</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Liên hệ
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Email: support@moviebooking.vn</li>
            <li>Hotline: 1900 9999</li>
            <li>Địa chỉ: TP.HCM</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} Movie Booking System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
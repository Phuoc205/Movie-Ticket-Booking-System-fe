import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/header.css';

const Header: React.FC = () => {
  const auth = useContext(AuthContext);

  const getHistoryLink = () => {
    if (!auth?.user) return "/login";

    if (auth.user.role === "ADMIN" || auth.user.role === "STAFF") {
      return "/all-history";
    }

    return "/bookings/history";
  };

  return (
    <header className="header">
      <div className="header-container">
        
        <Link to="/" className="logo">
          <span className="logo-icon">🎬</span>
          <span className="hidden sm:inline">Cine</span>
          <span className="text-blue-500">Max</span>
        </Link>

        <nav className="nav">
          {auth?.isAuthenticated && auth.user ? (
            <>
              {(auth.user.role === 'ADMIN' || auth.user.role === 'STAFF') && (
                <Link
                  to={auth.user.role === 'ADMIN' ? "/admin" : "/staff"}
                  className="nav-link"
                >
                  {auth.user.role === 'ADMIN' ? 'Admin Dashboard' : 'Staff Portal'}
                </Link>
              )}

              {auth.user.role === "ADMIN" && (
                <Link to="/admin/reports" className="nav-link">
                  📊 Report
                </Link>
              )}

              <Link to={getHistoryLink()} className="nav-link">
                Lịch Sử Đặt Vé
              </Link>

              <span className="flex items-center gap-2">
                <div className="avatar">
                  {auth.user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-gray-300">
                  {auth.user.full_name}
                </span>
              </span>

              <button onClick={() => auth.logout()} className="logout-btn">
                Thoát
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Đăng Nhập
              </Link>
              <Link to="/register" className="nav-btn">
                Đăng Ký
              </Link>
            </>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;
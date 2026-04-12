import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-[var(--border-card)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <span className="text-blue-500 text-3xl leading-none origin-bottom -rotate-12 transform">🎬</span>
          <span className="hidden sm:inline">Cine</span><span className="text-blue-500">Max</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5 text-sm font-medium">
          {auth?.isAuthenticated && auth.user ? (
            <>
              {(auth.user.role === 'ADMIN' || auth.user.role === 'STAFF') && (
                <Link to={auth.user.role === 'ADMIN' ? "/admin" : "/staff"} className="text-blue-300 hover:text-white transition-colors bg-blue-900/40 px-3 py-1.5 rounded-md border border-blue-800 hidden sm:block">
                  {auth.user.role === 'ADMIN' ? 'Admin Dashboard' : 'Staff Portal'}
                </Link>
              )}
              <Link to="/history" className="text-gray-300 hover:text-white transition-colors bg-gray-800/60 px-3 py-1.5 rounded-md border border-gray-700 hidden sm:block">
                Lịch Sử Vé
              </Link>
              <span className="text-gray-300 sm:border-l sm:border-gray-700 sm:pl-5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                  {auth.user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{auth.user.full_name}</span>
              </span>
              <button onClick={() => auth.logout()} className="text-red-400 hover:text-red-300 bg-red-900/20 px-3 py-1.5 rounded-md font-bold transition-colors">
                Thoát
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors py-2">Đăng Nhập</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-colors font-bold shadow-[0_4px_15px_rgba(37,99,235,0.4)]">
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

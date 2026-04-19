import React, { useState } from 'react';
import ManageMovies from '../components/dashboard/ManageMovies';
import ManageShowtimes from '../components/dashboard/ManageShowtimes';
import ManageVouchers from '../components/dashboard/ManageVouchers';
import RoomConfig from '../components/dashboard/RoomConfig';
import ManageHistory from '../components/dashboard/ManageHistory';
const Dashboard = () => {
  const [activeTab, setActiveTab] =
    useState< 'MOVIES' | 'SHOWTIMES' | 'BOOKINGS' | 'VOUCHERS' | 'ROOMS'>('MOVIES');

  return (
    <div className="page-container p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-900/40 p-2 rounded-2xl w-max border border-[var(--border-card)]">
          <button
            onClick={() => setActiveTab('MOVIES')}
            className={activeTab === 'MOVIES' ? 'btn-tab-active' : 'btn-tab'}
          >
            Quản Lý Phim
          </button>
          <button
            onClick={() => setActiveTab('SHOWTIMES')}
            className={activeTab === 'SHOWTIMES' ? 'btn-tab-active' : 'btn-tab'}
          >
            Lên Lịch Chiếu
          </button>
          <button
            onClick={() => setActiveTab('ROOMS')}
            className={activeTab === 'ROOMS' ? 'btn-tab-active' : 'btn-tab'}
          >
            Cấu Hình Phòng Chiếu
          </button>
          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={activeTab === 'BOOKINGS' ? 'btn-tab-active' : 'btn-tab'}
          >
            Quản Lý Vé Bán
          </button>
          <button
            onClick={() => setActiveTab('VOUCHERS')}
            className={activeTab === 'VOUCHERS' ? 'btn-tab-active' : 'btn-tab'}
          >
            Quản Lý Voucher
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === 'MOVIES' && <ManageMovies />}
        {activeTab === 'SHOWTIMES' && <ManageShowtimes />}
        {activeTab === 'BOOKINGS' && <ManageHistory />}
        {activeTab === 'VOUCHERS' && <ManageVouchers />}
        {activeTab === 'ROOMS' && <RoomConfig />}
      </div>
    </div>
  );
};

export default Dashboard;
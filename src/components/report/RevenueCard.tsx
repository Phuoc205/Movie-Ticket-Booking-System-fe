import React from 'react';

const RevenueCard = ({ revenue }: { revenue: number }) => {
  return (
    <div className="p-6 rounded-xl bg-black/40 border border-gray-800">
      <p className="text-gray-400">Tổng Doanh Thu</p>
      <p className="text-3xl font-bold text-green-400">
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(revenue)}
      </p>
    </div>
  );
};

export default RevenueCard;
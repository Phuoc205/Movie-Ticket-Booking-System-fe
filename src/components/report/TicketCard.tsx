import React from 'react';

const TicketCard = ({ total }: { total: number }) => {
  return (
    <div className="p-6 rounded-xl bg-black/40 border border-gray-800">
      <p className="text-gray-400">Vé Đã Bán</p>
      <p className="text-3xl font-bold text-blue-400">
        {total}
      </p>
    </div>
  );
};

export default TicketCard;
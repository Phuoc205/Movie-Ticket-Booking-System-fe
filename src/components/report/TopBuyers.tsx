import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const TopBuyers = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reports/top-buyers')
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="p-6 rounded-xl bg-black/40 border border-gray-800">
      <h3 className="text-xl font-bold mb-4">Top khách hàng</h3>

      <div className="space-y-3">
        {data.map((u, index) => (
          <div key={u.userId} className="flex justify-between">
            <span>
              #{index + 1} {u.fullName}
            </span>
            <span className="text-yellow-400 font-bold">
              {Number(u.totalSpent).toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBuyers;
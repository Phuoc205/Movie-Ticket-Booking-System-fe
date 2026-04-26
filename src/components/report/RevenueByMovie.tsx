import { useEffect, useState } from 'react';
import api from '../../services/api';

const RevenueByMovie = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reports/revenue-by-movie')
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="p-6 rounded-xl bg-black/40 border border-gray-800">
      <h3 className="text-xl font-bold mb-4">Doanh thu theo phim</h3>

      <div className="space-y-3">
        {data.map((m) => (
          <div key={m.movieId} className="flex justify-between">
            <span>{m.movieTitle}</span>
            <span className="text-green-400 font-bold">
              {Number(m.revenue).toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueByMovie;
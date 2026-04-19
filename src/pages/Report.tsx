// import React, { useEffect, useState } from 'react';
// import api from '../../services/api';
// import toast from 'react-hot-toast';

// interface Report {
//   revenue: number;
//   total_tickets: number;
// }

// const Report = () => {
//   const [reportData, setReportData] = useState<Report | null>(null);
//   const [isLoadingReports, setIsLoadingReports] = useState(true);

//   const fetchReports = async () => {
//     setIsLoadingReports(true);
//     try {
//       const response = await api.get('/reports');
//       setReportData(response.data);
//     } catch (error) {
//       toast.error('Không thể lấy báo cáo thống kê');
//     } finally {
//       setIsLoadingReports(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   return (
//     <div className="card-container animate-fade-in-up">

//       <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
//         📊 Thống Kê Tổng Quan
//       </h2>

//       {isLoadingReports ? (
//         <div className="flex justify-center p-16">
//           <div className="spinner"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//           {/* REVENUE */}
//           <div className="p-8 rounded-2xl bg-black/40 border border-gray-800 text-center">
//             <p className="text-gray-400 mb-3">Tổng Doanh Thu</p>
//             <p className="text-4xl font-bold text-green-400">
//               {new Intl.NumberFormat('vi-VN', {
//                 style: 'currency',
//                 currency: 'VND',
//               }).format(reportData?.revenue || 0)}
//             </p>
//           </div>

//           {/* TICKETS */}
//           <div className="p-8 rounded-2xl bg-black/40 border border-gray-800 text-center">
//             <p className="text-gray-400 mb-3">Vé Đã Bán</p>
//             <p className="text-4xl font-bold text-blue-400">
//               {reportData?.total_tickets || 0}
//             </p>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// };

// export default Report;

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RevenueCard from '../components/report/RevenueCard';
import TicketCard from '../components/report/TicketCard';
import RevenueByMovie from '../components/report/RevenueByMovie';
import TopBuyers from '../components/report/TopBuyers';

const ReportPage = () => {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/overview')
      .then(res => setOverview(res.data));
  }, []);

  if (!overview) {
    return <div className="spinner" />;
  }

  return (
    <div className="grid gap-6">

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueCard revenue={overview.revenue} />
        <TicketCard total={overview.total_bookings} />
      </div>

      {/* ANALYTICS */}
      <RevenueByMovie />
      <TopBuyers />

    </div>
  );
};

export default ReportPage;
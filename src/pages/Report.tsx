import { useEffect, useState } from 'react';
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
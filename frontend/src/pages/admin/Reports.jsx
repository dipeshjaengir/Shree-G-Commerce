import React, { useState } from 'react';
import { IoDownloadOutline, IoBarChartOutline, IoReceiptOutline } from 'react-icons/io5';
import DataTable from '../../components/admin/DataTable.jsx';
import DateRangePicker from '../../components/admin/DateRangePicker.jsx';
import StatCard from '../../components/admin/StatCard.jsx';
import Button from '../../components/Button.jsx';
import { toast } from 'react-hot-toast';

const MOCK_REPORT_DATA = [
  { date: '2026-07-12', revenue: 160, ordersCount: 1, avgOrderVal: 160 },
  { date: '2026-07-11', revenue: 630, ordersCount: 1, avgOrderVal: 630 },
  { date: '2026-07-10', revenue: 450, ordersCount: 2, avgOrderVal: 225 }
];

const Reports = () => {
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-12');

  const handleExportCSV = () => {
    toast.success('Simulated: Sales Report CSV file exported successfully.');
  };

  const handleExportExcel = () => {
    toast.success('Simulated: Sales Report Excel file generated successfully.');
  };

  // Cumulative metrics
  const totalRevenue = MOCK_REPORT_DATA.reduce((acc, row) => acc + row.revenue, 0);
  const totalOrders = MOCK_REPORT_DATA.reduce((acc, row) => acc + row.ordersCount, 0);
  const avgOrderValue = parseFloat((totalRevenue / (totalOrders || 1)).toFixed(2));

  const columns = [
    { header: 'Reporting Date', key: 'date', className: 'font-semibold font-mono' },
    { header: 'Revenue Processed', key: 'revenue', render: (row) => <span>₹{row.revenue}</span> },
    { header: 'Orders Volume', key: 'ordersCount' },
    { header: 'Avg Order Value (AOV)', key: 'avgOrderVal', render: (row) => <span>₹{row.avgOrderVal}</span> }
  ];

  return (
    <div className="space-y-8">
      
      {/* Date Filter & Export Panel */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 border border-zinc-200 bg-white p-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          label="Select Report Timeframe"
        />

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            icon={IoDownloadOutline}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportExcel}
            icon={IoDownloadOutline}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Metrics summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Segment Revenue" value={`₹${totalRevenue}`} icon={IoBarChartOutline} />
        <StatCard title="Total Orders Volume" value={`${totalOrders} Orders`} icon={IoReceiptOutline} />
        <StatCard title="Average Order Value" value={`₹${avgOrderValue}`} icon={IoBarChartOutline} />
      </div>

      {/* Detailed Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold tracking-widest uppercase text-left">Detailed Sales Breakdown</h3>
        <DataTable
          columns={columns}
          data={MOCK_REPORT_DATA}
        />
      </div>

    </div>
  );
};

export default Reports;

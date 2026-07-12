import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable.jsx';
import SearchToolbar from '../../components/admin/SearchToolbar.jsx';
import DateRangePicker from '../../components/admin/DateRangePicker.jsx';
import { adminService } from '../../services/adminService.js';
import { toast } from 'react-hot-toast';

const MOCK_AUDIT_LOGS = [
  { id: '1', timestamp: '2026-07-12T12:30:00.000Z', admin: { name: 'Super Admin' }, action: 'Update System settings', entityType: 'Settings', ipAddress: '192.168.1.1', remarks: 'GST rate adjusted.' },
  { id: '2', timestamp: '2026-07-12T11:45:00.000Z', admin: { name: 'Manager Staff' }, action: 'Adjust Stock (+50)', entityType: 'Inventory', ipAddress: '192.168.1.10', remarks: 'Stock of Basmati Rice replenished.' }
];

const ActivityLogs = () => {
  const [logs, setLogs] = useState(MOCK_AUDIT_LOGS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-12');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs();
      if (res.data.logs?.length > 0) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.warn('Audit logs backend API query failed. Utilizing local data fallback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [startDate, endDate]);

  const filteredLogs = logs.filter(l => {
    const adminName = l.admin?.name || 'System';
    const actionText = l.action || '';
    const changesText = l.remarks || '';
    return adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           actionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
           changesText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const columns = [
    { header: 'Date & Time', key: 'createdAt', render: (row) => (
      <span className="font-mono text-[10px]">{new Date(row.createdAt || row.timestamp).toLocaleString()}</span>
    )},
    { header: 'Administrator', key: 'admin', sortable: true, render: (row) => (
      <span className="font-semibold uppercase">{row.admin?.name || 'System'}</span>
    )},
    { header: 'Action', key: 'action', sortable: true },
    { header: 'Module/Entity', key: 'entityType' },
    { header: 'IP Address', key: 'ipAddress', className: 'font-mono text-zinc-400' },
    { header: 'Remarks/Details', key: 'remarks', render: (row) => (
      <span className="font-light text-[11px] max-w-[200px] block truncate" title={row.remarks || 'Success'}>
        {row.remarks || 'Changes saved successfully.'}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      
      {/* Search and Date filter toolbars */}
      <div className="space-y-4">
        <SearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search audit logs by admin name or action details..."
        />
        
        <div className="flex bg-white border border-zinc-200 p-4 justify-between items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
            label="Log Timeframe"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
      />

    </div>
  );
};

export default ActivityLogs;

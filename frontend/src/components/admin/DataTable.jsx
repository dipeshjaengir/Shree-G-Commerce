import React from 'react';
import SkeletonTable from './SkeletonTable.jsx';
import EmptyState from '../EmptyState.jsx';
import { IoChevronUpOutline, IoChevronDownOutline } from 'react-icons/io5';

const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  selectedRows = [],
  onRowSelectToggle,
  onSelectAllToggle,
  bulkActions = null,
  onSort,
  sortBy,
  sortOrder,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no entries available in this panel right now.'
}) => {
  if (isLoading) {
    return <SkeletonTable cols={columns.length + (onRowSelectToggle ? 1 : 0)} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const handleSelectAll = (e) => {
    if (onSelectAllToggle) {
      onSelectAllToggle(e.target.checked);
    }
  };

  const handleRowSelect = (e, rowId) => {
    e.stopPropagation();
    if (onRowSelectToggle) {
      onRowSelectToggle(rowId, e.target.checked);
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;

  return (
    <div className="space-y-4">
      {/* 1. BULK ACTIONS TOOLBAR */}
      {selectedRows.length > 0 && bulkActions && (
        <div className="flex items-center justify-between bg-zinc-900 text-white p-3 text-xs tracking-wider uppercase font-semibold">
          <span>{selectedRows.length} Records Selected</span>
          <div className="flex items-center gap-3">
            {bulkActions}
          </div>
        </div>
      )}

      {/* 2. TABLE GRID */}
      <div className="border border-zinc-200 bg-white overflow-x-auto">
        <table className="w-full text-left text-xs tracking-wider font-light border-collapse">
          
          {/* Table Headers */}
          <thead className="bg-[#F8F8F8] border-b border-zinc-200 text-black font-semibold uppercase">
            <tr>
              {onRowSelectToggle && (
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="accent-black rounded-none"
                  />
                </th>
              )}
              
              {columns.map((col) => {
                const isSortedCol = sortBy === col.key;
                return (
                  <th
                    key={col.key || col.header}
                    onClick={() => col.sortable && onSort && onSort(col.key)}
                    className={`px-6 py-4 select-none ${
                      col.sortable ? 'cursor-pointer hover:bg-zinc-100 transition-colors' : ''
                    } ${col.className || ''}`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.header}</span>
                      {col.sortable && onSort && (
                        <span className="text-zinc-400">
                          {isSortedCol && sortOrder === 'asc' && <IoChevronUpOutline className="w-3 h-3 text-black" />}
                          {isSortedCol && sortOrder === 'desc' && <IoChevronDownOutline className="w-3 h-3 text-black" />}
                          {!isSortedCol && <IoChevronDownOutline className="w-3 h-3 opacity-30" />}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body rows */}
          <tbody className="divide-y divide-zinc-200">
            {data.map((row, rIdx) => {
              const rowId = row._id || row.id;
              const isSelected = selectedRows.includes(rowId);

              return (
                <tr
                  key={rowId || rIdx}
                  className={`hover:bg-zinc-50/50 transition-colors ${
                    isSelected ? 'bg-zinc-50' : ''
                  }`}
                >
                  {onRowSelectToggle && (
                    <td className="px-6 py-3 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(e, rowId)}
                        className="accent-black rounded-none"
                      />
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key || col.header}
                      className={`px-6 py-3 text-zinc-600 ${col.className || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default DataTable;

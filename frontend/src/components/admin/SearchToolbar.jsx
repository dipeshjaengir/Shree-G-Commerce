import React from 'react';
import { IoSearchOutline, IoFilterOutline, IoDownloadOutline, IoAddOutline } from 'react-icons/io5';
import Button from '../Button.jsx';

const SearchToolbar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  onCreateClick,
  createLabel = 'Create New',
  onExportClick,
  exportLabel = 'Export CSV',
  onFilterToggle,
  showFilters = false,
  extraActions = null
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-200 bg-white p-4">
      {/* Search Input */}
      <div className="relative flex items-center bg-[#F8F8F8] border border-zinc-200 focus-within:border-black transition-colors h-10 px-4 w-full sm:max-w-xs">
        <IoSearchOutline className="w-4 h-4 text-zinc-400 shrink-0 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-xs tracking-wider border-none focus:outline-none placeholder-zinc-400 py-2"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
        {onFilterToggle && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onFilterToggle}
            icon={IoFilterOutline}
            className={`border ${showFilters ? 'bg-zinc-100 border-black' : ''}`}
          >
            Filters
          </Button>
        )}

        {onExportClick && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportClick}
            icon={IoDownloadOutline}
          >
            {exportLabel}
          </Button>
        )}

        {extraActions}

        {onCreateClick && (
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateClick}
            icon={IoAddOutline}
          >
            {createLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;

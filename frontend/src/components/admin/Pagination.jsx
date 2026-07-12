import React from 'react';
import Button from '../Button.jsx';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalDocs = 0,
  limit = 10,
  onPageChange,
  onLimitChange
}) => {
  if (totalPages <= 1 && totalDocs === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500 tracking-wider">
      
      {/* Counters Info */}
      <div className="font-light text-[10px] uppercase">
        Showing {Math.min((currentPage - 1) * limit + 1, totalDocs)} to{' '}
        {Math.min(currentPage * limit, totalDocs)} of {totalDocs} records
      </div>

      {/* Pages controls */}
      <div className="flex items-center gap-4">
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-light uppercase">Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-zinc-200 bg-white text-[10px] px-2 py-1 outline-none focus:border-black rounded-none font-semibold"
            >
              {[5, 10, 20, 50].map(val => (
                <option key={val} value={val}>{val} Rows</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3"
          >
            Prev
          </Button>
          
          <span className="text-[10px] tracking-widest text-zinc-500 font-semibold px-2">
            PAGE {currentPage} OF {totalPages || 1}
          </span>
          
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3"
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Pagination;

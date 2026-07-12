import React from 'react';

const SkeletonTable = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="border border-zinc-200 bg-white divide-y divide-zinc-200 animate-pulse">
      {/* Table Header skeleton */}
      <div className="h-10 bg-zinc-50 flex items-center justify-between px-6">
        {Array.from({ length: cols }).map((_, idx) => (
          <div key={idx} className="h-3 bg-zinc-200 w-1/6 rounded" />
        ))}
      </div>

      {/* Table Body rows */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="h-12 flex items-center justify-between px-6">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-2.5 bg-zinc-100 w-1/6 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;

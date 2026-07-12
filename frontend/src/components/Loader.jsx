import React from 'react';

// 1. FULL PAGE SPINNER
export const PageLoader = () => {
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] tracking-[0.3em] font-light text-zinc-400 uppercase animate-pulse">
        Loading Console
      </span>
    </div>
  );
};

// 2. CARD SKELETON
export const CardSkeleton = () => {
  return (
    <div className="border border-zinc-200 p-4 bg-white space-y-4 animate-pulse">
      {/* Image box placeholder */}
      <div className="w-full h-40 bg-zinc-100" />
      
      {/* Title placeholder */}
      <div className="space-y-2">
        <div className="h-2.5 bg-zinc-100 w-1/3 rounded" />
        <div className="h-3.5 bg-zinc-100 w-3/4 rounded" />
      </div>

      {/* Pricing block placeholder */}
      <div className="flex gap-2">
        <div className="h-3.5 bg-zinc-100 w-1/4 rounded" />
        <div className="h-3 bg-zinc-100 w-1/5 rounded" />
      </div>

      {/* Button placeholder */}
      <div className="h-8 bg-zinc-100 w-full" />
    </div>
  );
};

// 3. TABLE/ROW SKELETON
export const RowSkeleton = ({ cols = 4 }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-100 animate-pulse bg-white">
      {Array.from({ length: cols }).map((_, idx) => (
        <div key={idx} className="h-3 bg-zinc-100 w-1/5 rounded" />
      ))}
    </div>
  );
};

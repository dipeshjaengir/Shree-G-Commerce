import React from 'react';

const DateRangePicker = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label = 'Date Filter',
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light text-left">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="border border-zinc-200 bg-white text-[10px] px-2.5 py-1.5 outline-none focus:border-black rounded-none font-semibold uppercase"
        />
        <span className="text-zinc-300 text-xs font-light">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="border border-zinc-200 bg-white text-[10px] px-2.5 py-1.5 outline-none focus:border-black rounded-none font-semibold uppercase"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;

import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  trend,
  trendType = 'neutral', // up, down, neutral, danger
  icon: Icon = null,
  className = ''
}) => {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-zinc-400',
    neutral: 'text-zinc-500',
    danger: 'text-red-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-zinc-200 p-6 flex flex-col justify-between hover:border-black transition-colors ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-light">
            {title}
          </span>
          <h3 className="text-2xl font-light tracking-wide text-black mt-1">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {trend && (
        <span className={`text-[9px] tracking-wider font-light mt-4 ${trendColor[trendType]}`}>
          {trend}
        </span>
      )}
    </motion.div>
  );
};

export default StatCard;

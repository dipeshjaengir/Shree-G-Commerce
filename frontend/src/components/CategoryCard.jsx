import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({
  name,
  image,
  itemsCount,
  onClick,
  className = ''
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`bg-white border border-zinc-200 p-4 flex flex-col items-center text-center cursor-pointer group hover:border-black transition-colors duration-300 ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Category Image Box */}
      <div className="w-full h-32 overflow-hidden mb-4 bg-zinc-50 flex items-center justify-center relative">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Category Info */}
      <h4 className="text-xs font-semibold tracking-wider text-black group-hover:text-zinc-600 transition-colors uppercase">
        {name}
      </h4>
      {itemsCount && (
        <span className="text-[9px] tracking-wider text-zinc-400 mt-1 uppercase font-light">
          {itemsCount}
        </span>
      )}
    </motion.div>
  );
};

export default CategoryCard;

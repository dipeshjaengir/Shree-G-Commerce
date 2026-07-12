import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col md:flex-row bg-[#F8F8F8] font-sans selection:bg-black selection:text-white">
      {/* 1. LEFT SIDE: COLLECTION (Coming Soon) */}
      <motion.div 
        onClick={() => navigate('/collection')}
        className="w-full md:w-1/2 h-1/2 md:h-full bg-black text-white flex flex-col justify-center items-center cursor-pointer relative group transition-all duration-700"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Subtle Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
        
        {/* Inner Label Container */}
        <div className="z-10 flex flex-col items-center gap-3">
          <motion.h2 
            className="text-3xl md:text-5xl font-extralight tracking-[0.25em] text-white transition-transform duration-500 group-hover:scale-105 group-hover:tracking-[0.3em]"
          >
            COLLECTION
          </motion.h2>
          <span className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-400 font-light uppercase">
            Coming Soon
          </span>
          {/* Animated Hover Line */}
          <div className="w-8 h-[1px] bg-zinc-600 mt-2 transition-all duration-500 group-hover:w-20 group-hover:bg-white"></div>
        </div>
      </motion.div>

      {/* 2. RIGHT SIDE: MART */}
      <motion.div 
        onClick={() => navigate('/mart')}
        className="w-full md:w-1/2 h-1/2 md:h-full bg-[#F8F8F8] text-black flex flex-col justify-center items-center cursor-pointer relative group transition-all duration-700"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Subtle Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
        
        {/* Inner Label Container */}
        <div className="z-10 flex flex-col items-center gap-3">
          <motion.h2 
            className="text-3xl md:text-5xl font-extralight tracking-[0.25em] text-black transition-transform duration-500 group-hover:scale-105 group-hover:tracking-[0.3em]"
          >
            MART
          </motion.h2>
          <span className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-500 font-light uppercase">
            Shop Grocery
          </span>
          {/* Animated Hover Line */}
          <div className="w-8 h-[1px] bg-zinc-300 mt-2 transition-all duration-500 group-hover:w-20 group-hover:bg-black"></div>
        </div>
      </motion.div>

      {/* 3. CENTER SPLIT OVERLAY BRAND CONTAINER */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'backOut' }}
      >
        {/* Premium Minimal Monochrome SVG Logo */}
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100 flex justify-center items-center mb-4 transition-all duration-500">
          <span className="text-xl md:text-2xl font-semibold tracking-[0.2em] ml-1">SG</span>
        </div>
        
        {/* Brand Name */}
        <h1 className="text-xl md:text-3xl font-light tracking-[0.5em] text-center whitespace-nowrap bg-gradient-to-r from-white via-zinc-400 to-black bg-clip-text text-transparent drop-shadow-sm select-none">
          SHREE G
        </h1>
      </motion.div>
    </div>
  );
};

export default LandingPage;

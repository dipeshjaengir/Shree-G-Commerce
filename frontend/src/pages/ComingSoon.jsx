import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBackOutline } from 'react-icons/io5';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col justify-between items-center p-8 font-sans selection:bg-white selection:text-black">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

      {/* Header (Back button & Initials Logo) */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 text-sm tracking-widest font-light group"
        >
          <IoArrowBackOutline className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          BACK
        </button>
        <span className="text-lg font-light tracking-[0.3em] text-zinc-300 select-none">SG</span>
      </div>

      {/* Main Luxury Coming Soon Teaser */}
      <div className="flex flex-col items-center text-center z-10 max-w-2xl px-4">
        <motion.span 
          className="text-xs tracking-[0.5em] text-zinc-500 font-light mb-6 uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Shree G Luxury
        </motion.span>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-extralight tracking-[0.2em] mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          THE COLLECTION
        </motion.h1>

        <motion.p 
          className="text-xs md:text-sm tracking-widest text-zinc-400 font-light leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Curated streetwear, premium fabrics, and architectural silhouettes. A new expression of minimalism is taking form. Launching Fall 2026.
        </motion.p>

        {/* Minimalist Input Form (Notify Me) */}
        <motion.form 
          onSubmit={(e) => {
            e.preventDefault();
            alert('Thank you for subscribing to updates.');
          }}
          className="w-full max-w-md flex border-b border-zinc-700 pb-1"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <input 
            type="email" 
            placeholder="ENTER YOUR EMAIL FOR EARLY ACCESS" 
            required
            className="w-full bg-transparent border-none text-[10px] md:text-xs tracking-[0.2em] text-white focus:outline-none placeholder-zinc-600 py-2 font-light"
          />
          <button 
            type="submit"
            className="text-[10px] md:text-xs tracking-[0.2em] font-medium text-white hover:text-zinc-300 transition-colors py-2 px-3 whitespace-nowrap"
          >
            NOTIFY ME
          </button>
        </motion.form>
      </div>

      {/* Footer copyright */}
      <div className="z-10 text-[9px] md:text-[10px] tracking-[0.3em] text-zinc-600 font-light uppercase">
        © 2026 SHREE G. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
};

export default ComingSoon;

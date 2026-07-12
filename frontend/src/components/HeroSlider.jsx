import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

const DEFAULT_BANNERS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    title: 'THE HARVEST SEASON',
    subtitle: '100% ORGANIC & FRESH HARVEST DAILY',
    buttonText: 'Shop Harvest',
    link: '/mart'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    title: 'DEALS OF THE MONTH',
    subtitle: 'UP TO 40% OFF ON ESSENTIAL PANTRY STAPLES',
    buttonText: 'Explore Sales',
    link: '/mart'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1200&q=80',
    title: 'BAKERY FRESH BREADS',
    subtitle: 'HAND-CRAFTED SOURDOUGH & WHOLE WHEAT LOAVES',
    buttonText: 'Shop Bakery',
    link: '/mart'
  }
];

const HeroSlider = ({ banners = DEFAULT_BANNERS, autoPlay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, interval);
    return () => clearInterval(timer);
  }, [banners.length, autoPlay, interval]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const slideVariants = {
    initial: { opacity: 0, scale: 1.02 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 }
  };

  return (
    <div className="relative w-full h-[300px] md:h-[450px] bg-black overflow-hidden group">
      
      {/* 1. SLIDES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover opacity-90"
          />

          {/* Banner Contents */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 text-white max-w-xl space-y-4">
            <span className="text-[9px] md:text-[10px] tracking-[0.4em] text-zinc-300 font-light uppercase">
              {banners[current].subtitle}
            </span>
            <h2 className="text-2xl md:text-5xl font-extralight tracking-wide leading-tight uppercase">
              {banners[current].title}
            </h2>
            <div className="pt-2">
              <button className="text-[10px] tracking-[0.25em] font-semibold border-b border-white pb-1 hover:text-zinc-300 transition-colors uppercase">
                {banners[current].buttonText}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 2. MANUAL NAVIGATION CONTROLS */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/20 bg-black/20 hover:bg-black/60 hover:border-white text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <IoChevronBackOutline className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-white/20 bg-black/20 hover:bg-black/60 hover:border-white text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <IoChevronForwardOutline className="w-5 h-5" />
          </button>
        </>
      )}

      {/* 3. PAGINATION DOT INDICATORS */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default HeroSlider;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline, IoCloseOutline, IoTimeOutline, IoTrendingUpOutline } from 'react-icons/io5';

const TRENDING_SEARCHES = [
  'Basmati Rice',
  'Organic Sunflower Oil',
  'Farm Fresh Eggs',
  'Wheat Sourdough Bread',
  'Fresh Vegetables'
];

const SearchBar = ({ placeholder = "Search for grocery, staples, fresh items..." }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close overlay on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    if (!searchTerm.trim()) return;

    // 1. Add to recent searches list
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    // 2. Clear focus states and query
    setShowSuggestions(false);
    
    // 3. Navigate to search page
    navigate(`/mart/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(query);
    }
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  return (
    <div ref={containerRef} className="flex-1 max-w-lg relative z-50">
      
      {/* Search Input Box */}
      <div className="relative flex items-center bg-[#F8F8F8] border border-zinc-200 focus-within:border-black transition-colors h-10 px-4">
        <IoSearchOutline className="w-4 h-4 text-zinc-400 shrink-0 mr-2.5" />
        
        <input
          type="text"
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs tracking-wider border-none focus:outline-none placeholder-zinc-400 py-2"
        />

        {query && (
          <button 
            onClick={() => setQuery('')}
            className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
          >
            <IoCloseOutline className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Overlay Dropdown */}
      {showSuggestions && (
        <div className="absolute top-11 left-0 right-0 bg-white border border-zinc-200 shadow-2xl p-4 space-y-4">
          
          {/* Section: Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] tracking-widest text-zinc-400 uppercase font-light border-b border-zinc-100 pb-1">
                <span>Recent Searches</span>
                <button 
                  onClick={clearRecentSearches}
                  className="hover:text-black font-semibold uppercase text-[9px]"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      handleSearchSubmit(term);
                    }}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-black transition-all text-left font-light"
                  >
                    <IoTimeOutline className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: Trending Searches */}
          <div className="space-y-2">
            <div className="text-[10px] tracking-widest text-zinc-400 uppercase font-light border-b border-zinc-100 pb-1">
              <span>Trending Searches</span>
            </div>
            <div className="space-y-1">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    handleSearchSubmit(term);
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-black transition-all text-left font-light"
                >
                  <IoTrendingUpOutline className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SearchBar;

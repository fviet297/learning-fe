import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Tìm kiếm:', searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    inputRef.current.focus();
  };
  
  useEffect(() => {
    // Effect for any additional search-related functionality
    // For example, you could implement debounced search here
  }, [searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSearch}>
        <motion.div 
          className="relative"
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Tìm kiếm module, flashcards..."
            className={`w-full pl-12 pr-10 py-3 text-gray-700 bg-white border transition-all duration-200 ${isFocused ? 'border-primary shadow-md' : 'border-gray-200 shadow-sm'} rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
          >
            <FiSearch className="w-5 h-5" />
          </motion.button>
          
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={clearSearch}
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </form>
    </motion.div>
  );
}

export default SearchBar;

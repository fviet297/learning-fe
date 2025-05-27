import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules, flashcards..."
            className="w-full pl-12 pr-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
          <button
            type="submit"
            className="absolute left-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
          >
            <FiSearch className="w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default SearchBar;

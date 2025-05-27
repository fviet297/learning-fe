import React from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <SearchBar />
        {children}
      </div>
    </div>
  );
}

export default Layout;

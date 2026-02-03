
import React, { useState } from 'react';
import { ICONS, COLORS } from '../constants';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-400 transition-colors">
          <ICONS.Search />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, actors, or 'Naija vibes'..."
          className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder:text-gray-500"
        />
      </div>
    </form>
  );
};

export default SearchBar;

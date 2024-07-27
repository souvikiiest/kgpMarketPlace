"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "../utils/searchDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    } else {
      onSearch("");
    }
  }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items..."
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;

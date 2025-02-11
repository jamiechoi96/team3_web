import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./Search.css";
import axios from "axios";
import SearchTop20 from './SearchTop20';

const Search = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/search?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  return (
    <div className="search">
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="보고 싶은 콘텐츠를 검색해보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            <FiSearch />
          </button>
        </div>
      </div>

      <div className="weekly-popular">
        <SearchTop20 />
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          {/* 검색 결과 렌더링 */}
        </div>
      )}
    </div>
  );
};

export default Search;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchTop20.css";

function SearchTop20() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('=== 서치 TOP 20 데이터 요청 시작 - client ===');
        const response = await axios.get('/api/search-top20');
        if (response.data.success) {
          console.log('=== 서치 TOP 20 영화 순위 ===');
          response.data.data.forEach(movie => {
            console.log(`${movie.ranking}위: ${movie.asset_nm}`);
          });
          console.log('=====================');
          setMovies(response.data.data);
        }
      } catch (error) {
        console.error("영화 데이터 조회 오류:", error);
      }
    };

    fetchMovies();
  }, []);

  const MovieCard = ({ movie }) => (
    <div className="movie-card-container">
      <div className="rank-area">
        <span className="rank-number" data-rank={movie.ranking}>
          {movie.ranking}
        </span>
      </div>
      <div className="poster-area">
        <img src={movie.posterUrl} alt={movie.asset_nm} />
        <div className="hover-content">
          <h3 className="movie-title">{movie.asset_nm}</h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="search-watching">
      <h2 className="search-top20-title">🎯금주의 인기 콘텐츠</h2>
      <div className="search-top20-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.ranking} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default SearchTop20;

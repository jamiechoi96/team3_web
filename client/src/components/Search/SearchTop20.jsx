import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchTop20.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API;
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function SearchTop20() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);

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

  const fetchMovieDetails = async (movieName) => {
    try {
      // TMDB 검색
      const searchResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieName)}&language=ko-KR`
      );

      if (searchResponse.data.results && searchResponse.data.results.length > 0) {
        const movieId = searchResponse.data.results[0].id;
        
        // 영화 상세 정보 가져오기
        const detailsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR&append_to_response=credits,images`
        );

        return {
          ...detailsResponse.data,
          backdrop_path: detailsResponse.data.backdrop_path 
            ? `${TMDB_IMAGE_BASE}${detailsResponse.data.backdrop_path}`
            : null,
          cast: detailsResponse.data.credits.cast.slice(0, 3),
          director: detailsResponse.data.credits.crew.find(person => person.job === "Director")
        };
      }
      return null;
    } catch (error) {
      console.error("TMDB 데이터 조회 오류:", error);
      return null;
    }
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setShowBanner(true);
    const details = await fetchMovieDetails(movie.asset_nm);
    setMovieDetails(details);
  };

  const MovieCard = ({ movie }) => (
    <div className="movie-card-container" onClick={() => handleMovieClick(movie)}>
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

  const DetailBanner = ({ movie, details, onClose }) => (
    <div className="search-banner">
      <div className="search-banner-popup">
        <div className="search-banner-content">
          <h1 className="search-banner-title">{movie.asset_nm}</h1>
          <p className="search-banner-rank" data-rank={movie.ranking}>
            {movie.ranking}위
          </p>
          <div className="search-banner-info">
            <p className="director">{details?.director ? details.director.name : ''}</p>
            <p className="cast">{details?.cast && details.cast.length > 0 ? details.cast.map(actor => actor.name).join(', ') : ''}</p>
          </div>
          <p className="search-banner-description">{details?.overview || "상세 설명이 없습니다."}</p>
          <div className="search-banner-buttons">
            <button className="search-banner-button play">▶ 재생</button>
            <button className="search-banner-button" onClick={onClose}>✕ 닫기</button>
          </div>
        </div>
        <div className="search-banner-image-container">
          <img
            src={details?.backdrop_path || movie.posterUrl}
            alt={movie.asset_nm}
            className="search-banner-image"
          />
          <div className="search-banner-gradient"></div>
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
      {showBanner && selectedMovie && (
        <DetailBanner 
          movie={selectedMovie}
          details={movieDetails}
          onClose={() => {
            setShowBanner(false);
            setSelectedMovie(null);
            setMovieDetails(null);
          }} 
        />
      )}
    </div>
  );
}

export default SearchTop20;

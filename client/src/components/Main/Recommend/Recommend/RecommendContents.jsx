import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Popup from '../Popup/Popup';
import AdvertisementBanner from './AdBanner';
import "./RecommendContents.css";

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = "https://image.tmdb.org/t/p/original";

function RecommendContents() {
  // 상태 변수 선언
  const [newMovies, setNewMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [summaryMovies, setSummaryMovies] = useState([]);
  const [preferredGenreMovies, setPreferredGenreMovies] = useState([]); // 선호 장르 기반 영화
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 컴포넌트가 마운트될 때 영화 목록을 가져오는 useEffect
  useEffect(() => {
    fetchNewVods();
    fetchSimilarVods();
    fetchSummaryVods();
    fetchPreferredGenreVods(); // 선호 장르 기반 영화 가져오기
  }, []);

  /** 신작 VOD 가져오기 */
  const fetchNewVods = async () => {
    try {
      const response = await axios.get('/api/new-vods');
      if (response.data.success) setNewMovies(response.data.data);
    } catch (error) {
      console.error("신작 VOD API 오류:", error.response?.data || error.message);
    }
  };

  /** 비슷한 시청 기록 기반 추천 가져오기 */
  const fetchSimilarVods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/similar-vods', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) setSimilarMovies(response.data.data);
    } catch (error) {
      console.error("비슷한 시청 기록 추천 API 오류:", error.response?.data || error.message);
    }
  };

  /** 줄거리 기반 추천 가져오기 */
  const fetchSummaryVods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/summary-recommend', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setSummaryMovies(response.data.data.length > 0 ? response.data.data : []);
      }
    } catch (error) {
      console.error("줄거리 기반 추천 API 오류:", error.response?.data || error.message);
      setSummaryMovies([]);
    }
  };

  /** 선호 장르 기반 추천 가져오기 */
  const fetchPreferredGenreVods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/preferred-genre', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        const movies = response.data.data || [];
        setPreferredGenreMovies(movies.length > 0 ? movies : []);
      } else {
        console.error("선호 장르 기반 추천 응답 형식 오류:", response.data);
        setPreferredGenreMovies([]);
      }
    } catch (error) {
      console.error("선호 장르 기반 추천 API 오류:", error.response?.data || error.message);
      setPreferredGenreMovies([]);
    }
  };

  /** 영화 정보 팝업 핸들러 */
  const handleInfoClick = (movie) => {
    setSelectedMovie({ ...movie, hover: movie.backdropUrl });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
  };

  /** 공통 슬라이더 설정 */
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    autoplay: false,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } }
    ]
  };

  /** 슬라이더 렌더링 함수 */
  const renderMovieSlider = (movies, title) => (
    <div>
      <h2 className="section_title">{title}</h2>
      {movies.length > 0 ? (
        <Slider {...sliderSettings} className="slider_wrapper recommend_slider">
          {movies.map((movie, index) => (
            <div key={index} className="movie_card">
              <img
                src={movie.poster_path ? `${imageUrl}${movie.poster_path}` : movie.posterUrl}
                alt={movie.asset_nm}
                className="movie_image"
              />
              <div className="movie_hover">
                <div className="movie_title">{movie.asset_nm}</div>
                <div className="movie_buttons">
                  <button className="play_btn">▶ 재생</button>
                  <button className="info_btn" onClick={() => handleInfoClick(movie)}>ℹ️ 정보</button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div></div>
      )}
    </div>
  );

  return (
    <div className="recommend_contents">
      {renderMovieSlider(newMovies, <span>🗓️이번 달 <span className="title_point">새롭게 추가된</span> 영화에요</span>)}
      {renderMovieSlider(similarMovies, <span>🎯<span className="title_point">취향이 비슷한</span> 사람들이 많이 본 영화에요</span>)}
      <AdvertisementBanner />
      {renderMovieSlider(summaryMovies, <span>📖이 작품과 <span className="title_point">비슷한 줄거리</span>를 가진 영화에요</span>)}
      
      {renderMovieSlider(preferredGenreMovies, <span>🎬고객님이 많이 본 <span className="title_point">{preferredGenreMovies[0]?.genre}</span> 장르의 영화에요</span>)}

      {showPopup && selectedMovie && <Popup movie={selectedMovie} onClose={closePopup} />}
    </div>
  );
}

export default RecommendContents;

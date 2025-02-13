import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Popup from '../Popup/Popup';
import "./RecommendContents.css";
import AdvertisementBanner from './AdBanner';

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = "https://image.tmdb.org/t/p/original";

function RecommendContents() {
  const [newMovies, setNewMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [summaryMovies, setSummaryMovies] = useState([]); 
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const sectionRefs = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 신작 VOD 가져오기
        const newVodsResponse = await axios.get('/api/new-vods');
        if (newVodsResponse.data.success) {
          setNewMovies(newVodsResponse.data.data);
        }

        // 비슷한 시청 기록 가져오기
        try {
          const token = localStorage.getItem('token');
          const similarResponse = await axios.post('/api/similar-vods', 
            {}, 
            { 
              headers: { 
                'Authorization': `Bearer ${token}` 
              }
            }
          );
          console.log('서버 응답:', similarResponse.data);
          if (similarResponse.data.success) {
            setSimilarMovies(similarResponse.data.data);
          }

          // 줄거리 기반 추천 가져오기
          const currentContentHash = localStorage.getItem('sha2_Hash');
          console.log('현재 콘텐츠 해시:', currentContentHash);
          try {
            const summaryResponse = await axios.get('/api/summary-recommend', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log('줄거리 기반 추천 응답:', summaryResponse.data);
            if (summaryResponse.data.success && summaryResponse.data.data.length > 0) {
              setSummaryMovies(summaryResponse.data.data);
              console.log('줄거리 기반 추천 영화:', summaryResponse.data.data);
            } else {
              console.warn('줄거리 기반 추천 데이터 없음');
              setSummaryMovies([]);
            }
          } catch (error) {
            console.error('줄거리 기반 추천 API 오류:', error.response?.data || error.message);
            setSummaryMovies([]);
          }

          // 장르 기반 추천 가져오기
          const genreResponse = await axios.get('/api/genre-vods', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (genreResponse.data.success) {
            setGenreMovies(genreResponse.data.data);
          }

        } catch (error) {
          console.error('API 요청 오류:', error.response?.data || error.message);
        }

      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  const handleInfoClick = (movie) => {
    setSelectedMovie({
      ...movie,
      hover: movie.backdropUrl
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
  };

  const settings_recommendation = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    autoplay: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  };

  const renderSummaryRecommendations = () => {
    console.log('현재 줄거리 기반 추천 영화:', summaryMovies);
    
    if (summaryMovies.length === 0) {
      return <div>추천 영화가 없습니다.</div>;
    }

    return (
      <Slider {...settings_recommendation} className="slider_wrapper">
        {summaryMovies.map((movie, index) => (
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
    );
  };

  return (
    <div className="recommend_contents">
      <h2 className="section_title">🗓️이번 달 신작이에요</h2>
      <Slider {...settings_recommendation} className="slider_wrapper">
        {newMovies.map((movie, index) => (
          <div key={index} className="movie_card">
            <img
              src={movie.posterUrl}
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

      <h2 className="section_title">🫱🏻‍🫲🏼나와 비슷한 사람들은 이런 작품을 봤어요</h2>
      <Slider {...settings_recommendation} className="slider_wrapper">
        {similarMovies.map((movie, index) => (
          <div key={index} className="movie_card">
            <img
              src={movie.posterUrl}
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

      <AdvertisementBanner />

      <h2 className="section_title">📖 줄거리가 비슷한 작품을 찾아봤어요</h2>
      {renderSummaryRecommendations()}

      <h2 className="section_title">🎬 이런 장르는 어떠세요?</h2>
      <Slider {...settings_recommendation} className="slider_wrapper">
        {genreMovies.map((movie, index) => (
          <div key={index} className="movie_card">
            <img
              src={movie.posterUrl}
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

      {showPopup && selectedMovie && (
        <Popup movie={selectedMovie} onClose={closePopup} />
      )}
    </div>
  );
}

export default RecommendContents;

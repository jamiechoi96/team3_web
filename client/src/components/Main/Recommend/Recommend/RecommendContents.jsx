import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Popup from '../Popup/Popup'
import "./RecommendContents.css";

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = "https://image.tmdb.org/t/p/original";

function RecommendContents() {
  const [movies, setMovies] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=Inside%20Out&language=ko-KR`
        );

        const validMovies = response.data.results
          .filter((movie) => movie.poster_path && movie.title)
          .map((movie) => ({
            image: `${imageUrl}${movie.poster_path}`,
            hover: `${imageUrl}${movie.backdrop_path || movie.poster_path}`,
            title: movie.title,
            overview: movie.overview,
            releaseDate: movie.release_date,
            rating: movie.vote_average
          }));
        setMovies(validMovies.slice(0, 20));
      } catch (error) {
        console.error("영화를 가져오는 중 오류 발생:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleInfoClick = (movie) => {
    setSelectedMovie(movie);
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

  return (
    <div className="recommend_contents">
      <h2 className="section_title">새로나온 신작</h2>
      <Slider {...settings_recommendation} className="slider_wrapper">
        {movies.map((movie, index) => (
          <div key={index} className="movie_card">
            <img
              src={movie.image}
              alt={movie.title}
              className="movie_image"
            />
            <div className="movie_hover">
              <div className="movie_title">{movie.title}</div>
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

      <h2 className="section_title">나와 비슷한 사람들은 무슨 작품을 봤을까요?</h2>
      <Slider {...settings_recommendation} className="slider_wrapper">
        {movies.map((movie, index) => (
          <div key={index} className="movie_card">
            <img
              src={movie.image}
              alt={movie.title}
              className="movie_image"
            />
            <div className="movie_hover">
              <div className="movie_title">{movie.title}</div>
              <div className="movie_buttons">
                <button className="play_btn">▶ 재생</button>
                <button className="info_btn" onClick={() => handleInfoClick(movie)}>ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <h2 className="section_title">이런 장르는 어떠세요?</h2>
      <Slider {...settings_recommendation} className="slider_wrapper">
        {movies.map((movie, index) => (
          <div key={index} className="movie_card">
            <img
              src={movie.image}
              alt={movie.title}
              className="movie_image"
            />
            <div className="movie_hover">
              <div className="movie_title">{movie.title}</div>
              <div className="movie_buttons">
                <button className="play_btn">▶ 재생</button>
                <button className="info_btn" onClick={() => handleInfoClick(movie)}>ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default RecommendContents;

import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageCard from "./ImageCard";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./TOP20.css";

const API_KEY = '0058a62923db25cb8d799d267036fb75';  // 하드코딩

function TOP20() {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(movies.length / 6);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        console.log('=== TOP 20 데이터 요청 시작 - client ===');
        const response = await axios.get('/api/top20');
        if (response.data.success) {
          console.log('=== TOP 20 영화 순위 ===');
          response.data.data.forEach(movie => {
            console.log(`${movie.rank}위: ${movie.asset_nm}`);
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

  const settings_top20 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: false,
    arrows: true,
    variableWidth: true,  // 가변 너비 활성화
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
          variableWidth: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      }
    ]
  };

  return (
    <div className="watching">
      <p className="top20_title">👑금주의 TOP 20 영화</p>
      <div className={`slider-container ${currentSlide === totalSlides - 1 ? 'last-slide' : ''}`}>
        <Slider {...settings_top20} className="top20_slider">
          {movies.map((movie) => (
            <ImageCard
              key={movie.ranking}
              rank={movie.ranking}
              image={movie.posterUrl}
              title={movie.asset_nm}
              hover={movie.backdropUrl}
              overview={movie.overview}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default TOP20;

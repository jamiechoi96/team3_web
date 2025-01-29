import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ImageCard from "./ImageCard";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./TOP20.css";

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = "https://image.tmdb.org/t/p/original";

function TOP20() {
  const [movies, setMovies] = useState([]);

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
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  return (
    <div className="watching">
      <h2 className="title">금주의 TOP 20 추천🎯</h2>
      <Slider {...settings_top20}>
        {movies.map((movie) => (
          <ImageCard
            key={movie.rank}
            rank={movie.rank}
            image={movie.posterUrl}
            title={movie.asset_nm}
            hover={`${imageUrl}${movie.backdrop_path}`}
            overview = {movie.overview}
          />
        ))}
      </Slider>
    </div>
  );
}

export default TOP20;

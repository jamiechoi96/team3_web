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
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko-KO`
        );
        const validMovies = response.data.results.filter((movie) => movie.poster_path);
        setMovies(validMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 6,
    autoplay: false,
    arrows: true,
    centerMode: false,  // 중앙 정렬 비활성화
  };

  return (
    <div className="watching">
      <h2 className="title">금주의 TOP 20</h2>
      <Slider  {...settings}className="slider-container">
        {movies.map((movie, index) => (
          <ImageCard
            key={movie.id}
            rank={index + 1}
            image={`${imageUrl}${movie.poster_path}`}
            title={movie.title}
          />
        ))}
      </Slider>
    </div>
  );
}

export default TOP20;

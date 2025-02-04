import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "./RecommendContents.css";

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = "https://image.tmdb.org/t/p/original";

function RecommendContents() {
  const [movies, setMovies] = useState([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=0058a62923db25cb8d799d267036fb75&query=Inside%20Out&language=ko-KR`
        );

        // // 첫 번째 결과만 사용 (가장 연관성 높은 결과)
        // const movie = response.data.results[0];
        // if (movie?.poster_path && movie?.title) {
        //   setMovies([
        //     {
        //       image: `${imageUrl}${movie.poster_path}`,
        //       title: movie.title,
        //     },
        //   ]);
        // }

        const validMovies = response.data.results
          .filter((movie) => movie.poster_path && movie.title)
          .map((movie) => ({
            image: `${imageUrl}${movie.poster_path}`,
            title: movie.title,
          }));
        setMovies(validMovies.slice(0, 20));
      } catch (error) {
        console.error("영화를 가져오는 중 오류 발생:", error);
      }
    };

    fetchMovies();
  }, []);

  const scrollLeft = (index) => {
    sectionRefs.current[index].scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = (index) => {
    sectionRefs.current[index].scrollBy({
      left: 300,
      behavior: "smooth",
    });
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
      <h2 className="section_title">회원님을 위해 엄선한 콘텐츠</h2>
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
                <button className="info_btn">ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <h2 className="section_title">추천 리스트 1</h2>
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
                <button className="info_btn">ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <h2 className="section_title">추천 리스트 2</h2>
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
                <button className="info_btn">ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <h2 className="section_title">추천 리스트 3</h2>
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
                <button className="info_btn">ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <h2 className="section_title">추천 리스트 4</h2>
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
                <button className="info_btn">ℹ️ 정보</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default RecommendContents;

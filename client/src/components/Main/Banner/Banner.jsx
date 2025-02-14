import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Banner.css';
import { FaPlay } from 'react-icons/fa';

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = 'https://image.tmdb.org/t/p/original';

function Banner() {
    const [movies, setMovies] = useState([]);

    const fetchMovieDetails = async (movie) => {
        try {
            // TMDB에서 영화 검색
            const searchResponse = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.asset_nm)}&language=ko-KR`
            );

            if (searchResponse.data.results && searchResponse.data.results.length > 0) {
                const tmdbMovie = searchResponse.data.results[0];
                
                // 영화 상세 정보 가져오기
                const detailsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${tmdbMovie.id}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`
                );

                return {
                    ...movie,
                    backdrop_path: tmdbMovie.backdrop_path,
                    overview: tmdbMovie.overview,
                    title: movie.asset_nm,
                    cast: detailsResponse.data.credits.cast.slice(0, 3),
                    director: detailsResponse.data.credits.crew.find(person => person.job === "Director")
                };
            }
            return {
                ...movie,
                backdrop_path: null,
                overview: '줄거리 정보가 없습니다.',
                title: movie.asset_nm,
                cast: [],
                director: null
            };
        } catch (error) {
            console.error('영화 상세 정보 가져오기 실패:', error);
            return movie;
        }
    };

    useEffect(() => {
        const fetchBannerMovies = async () => {
            try {
                const response = await axios.get('/api/banner-vods');
                if (response.data.success !== false) {
                    const moviesWithDetails = await Promise.all(
                        response.data.data.map(fetchMovieDetails)
                    );
                    setMovies(moviesWithDetails);
                }
            } catch (error) {
                console.error('배너 영화 가져오기 실패:', error);
            }
        };

        fetchBannerMovies();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        fade: true
    };

    return (
        <div className="banner">
            <Slider {...settings}>
                {movies.map((movie) => (
                    <div key={movie.vod_id} className="slide">
                        <div className="content">
                            <h1 className="title">{movie.title}</h1>
                            <div className="movie-info">
                                {movie.director && (
                                    <p className="director">
                                        <span>감독:</span> {movie.director.name}
                                    </p>
                                )}
                                {movie.cast && movie.cast.length > 0 && (
                                    <p className="cast">
                                        <span>출연:</span> {movie.cast.map(actor => actor.name).join(', ')}
                                    </p>
                                )}
                            </div>
                            <p className="description">{movie.overview}</p>
                            <div className="banner_buttons">
                                <button className="button play-button">
                                    <FaPlay size={20} />
                                    <span>재생</span>
                                </button>
                            </div>
                        </div>
                        <div className="image-gradient"></div>
                        <img
                            src={movie.backdrop_path ? `${imageUrl}${movie.backdrop_path}` : '/default-backdrop.jpg'}
                            alt={movie.title}
                            className="slide-image"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Banner;

import React, { useEffect, useState } from 'react';
import axios from '../../../axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Banner.css';

const API_KEY = import.meta.env.VITE_TMDB_API;
const imageUrl = 'https://image.tmdb.org/t/p/original';

function Banner() {
    const [movies, setMovies] = useState([]);

    const fetchMovieDetails = async (movie) => {
        try {
            const response = await axios.get(
                `movie/${movie.id}?api_key=${API_KEY}&language=ko-KR&append_to_response=credits`
            );
            return {
                ...movie,
                cast: response.data.credits.cast.slice(0, 3),
                director: response.data.credits.crew.find(person => person.job === "Director")
            };
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return movie;
        }
    };

    useEffect(() => {
        axios
            .get(`trending/all/week?api_key=${API_KEY}&language=ko-KO`)
            .then(async (response) => {
                const validMovies = response.data.results.filter(
                    (movie) => movie.backdrop_path
                );
                const moviesWithDetails = await Promise.all(
                    validMovies.slice(0, 5).map(fetchMovieDetails)
                );
                setMovies(moviesWithDetails);
            })
            .catch((error) => {
                console.error('Error fetching movies:', error);
            });
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
                    <div key={movie.id} className="slide">
                        <div className="content">
                            <h1 className="title">{movie.original_name || movie.title}</h1>
                            <div className="movie-info">
                                {movie.director && (
                                    <p className="director">감독: {movie.director.name}</p>
                                )}
                                {movie.cast && movie.cast.length > 0 && (
                                    <p className="cast">출연: {movie.cast.map(actor => actor.name).join(', ')}</p>
                                )}
                            </div>
                            <p className="description">{movie.overview}</p>
                            <div className="banner_buttons">
                                <button className="button play-button">▶ 재생</button>
                            </div>
                            
                        </div>
                        <div className="image-gradient"></div>
                        <img
                            src={`${imageUrl + movie.backdrop_path}`}
                            alt={movie.title || movie.original_name}
                            className="slide-image"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Banner;

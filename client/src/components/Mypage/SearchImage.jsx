import React, { useState, useEffect } from 'react';
import "./SearchImage.css"
import axios from "axios";

const Image = ({ dbTitle }) => {
  const [imageUrl, setImageUrl] = useState('');
  const API_KEY = import.meta.env.VITE_TMDB_API;
  const baseUrl = "https://image.tmdb.org/t/p/original";

  // 제목에서 회차 제거하는 함수
  const extractTitle = (title) => {
    const regex = /^(.*?)(\d+\회)/; // 숫자+회 패턴 매칭
    const match = title.match(regex);
    return match ? match[1].trim() : title.split('(')[0].trim(); // 제목만 추출
  };

  useEffect(() => {
    const fetchMovieImage = async () => {
      const filteredTitle = extractTitle(dbTitle);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(filteredTitle)}&include_adult=false&language=ko-KO&page=1`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setImageUrl(`${baseUrl}${data.results[0].poster_path}`);
          console.log("Poster Path:", posterPath); // 포스터 경로 확인
        } else {
          console.error('No results found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovieImage();
  }, [dbTitle]);

  return (
    <div className='box'>
      {imageUrl ? (
        <img src={imageUrl} alt={dbTitle} className='image' />
      ) : (
        <p>이미지를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default Image;
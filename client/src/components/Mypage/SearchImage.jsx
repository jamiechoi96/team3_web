import React, { useState, useEffect } from 'react';
import "./SearchImage.css"
import axios from "axios";

const Image = ({ dbTitle }) => {
  const [imageUrl, setImageUrl] = useState('');
  const API_KEY = import.meta.env.VITE_TMDB_API;
  const baseUrl = "https://image.tmdb.org/t/p/original";

  // 제목에서 회차 제거하는 함수
  const extractTitle = (title) => {
    // "숫자+회" 패턴 제거
    const episodeRegex = /^(.*?)(\d+\회)/;
    let cleanTitle = title.match(episodeRegex) ? title.match(episodeRegex)[1].trim() : title.split('(')[0].trim();

    // 숫자가 포함된 타이틀 중 특정 패턴의 경우 숫자 제거
    const numberPatternRegex = /(.+?)\s?\d+$/;  // 공백 후 숫자가 있는 패턴

    if (cleanTitle.match(numberPatternRegex)) {
      const baseTitle = cleanTitle.match(numberPatternRegex)[1].trim();
      // 제거해야 할 경우
      const titlesToRemoveNumbers = ["낭만닥터 김사부", "모범택시"];
      if (titlesToRemoveNumbers.some(prefix => baseTitle.startsWith(prefix))) {
        cleanTitle = baseTitle;  // 숫자 제거
      }
    }
  
    return cleanTitle;
  };

  useEffect(() => {
    const fetchMovieImage = async () => {
      const filteredTitle = extractTitle(dbTitle);
      console.log("Searching for:", filteredTitle);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(filteredTitle)}&include_adult=false&language=ko-KO&page=1`
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
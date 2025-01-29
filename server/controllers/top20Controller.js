const Top20 = require('../models/top20');
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function getTop20(req, res) {
  try {
    console.log('Top 20 데이터 조회 시작...');
    const movies = await Top20.getTop20();
    
    // 각 영화의 포스터 정보 가져오기
    const moviesWithPosters = await Promise.all(
      movies.map(async (movie) => {
        try {
          const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
              api_key: TMDB_API_KEY,
              query: movie.asset_nm,
              language: 'ko-KR'
            }
          });

          if (searchResponse.data.results.length > 0) {
            const posterPath = searchResponse.data.results[0].poster_path;
            return {
              ...movie,
              posterUrl: posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null
            };
          }
          return { ...movie, posterUrl: null };
        } catch (error) {
          console.error(`포스터 검색 실패 (${movie.asset_nm}):`, error);
          return { ...movie, posterUrl: null };
        }
      })
    );

    console.log('Top 20 데이터 조회 완료');
    res.json({
      success: true,
      data: moviesWithPosters
    });
  } catch (error) {
    console.error('Top 20 데이터 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
}

module.exports = {
  getTop20
};

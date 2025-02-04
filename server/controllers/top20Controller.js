const Top20 = require('../models/top20Model');
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function getTop20(req, res) {
  try {
    console.log('=== TOP 20 데이터 조회 시작 ===');
    const movies = await Top20.getTop20();
    
    // TMDB API 키 확인
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API 키가 설정되지 않았습니다. 서버의 .env 파일을 확인해주세요!!');
    }

    // 각 영화의 포스터 정보 가져오기
    const moviesWithPosters = await Promise.all(
      movies.map(async (movie) => {
        try {
          const searchResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
              api_key: TMDB_API_KEY,
              query: movie.asset_nm,
              language: 'ko-KR',
              year: movie.year
            }
          });

          if (searchResponse.data.results.length > 0) {
            const movieData = searchResponse.data.results[0];
            return {
              ...movie,
              posterUrl: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
              backdropUrl: movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null,
              overview: movieData.overview || '줄거리 정보가 없습니다.',
              tmdbId: movieData.id
            };
          }
          return { 
            ...movie, 
            posterUrl: null,
            backdropUrl: null,
            overview: '영화 정보를 찾을 수 없습니다.'
          };
        } catch (error) {
          console.error(`[${movie.asset_nm}] 포스터 검색 실패:`, error.response?.data?.status_message || error.message);
          return { 
            ...movie, 
            posterUrl: null,
            backdropUrl: null,
            overview: '영화 정보를 가져오는데 실패했습니다.'
          };
        }
      })
    );

    console.log('=== TOP 20 데이터 조회 완료 ===');
    res.json({
      success: true,
      data: moviesWithPosters
    });
  } catch (error) {
    console.error('TOP 20 데이터 조회 오류:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || '서버 오류가 발생했습니다.'
    });
  }
}

module.exports = {
  getTop20
};

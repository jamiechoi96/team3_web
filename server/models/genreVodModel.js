const { executeQuery } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class GenreVod {
  static async getGenreVods() {
    try {
      // 인기 있는 장르의 VOD 가져오기
      const query = `
        
      `;

      const rows = await executeQuery(query);

      // TMDB에서 포스터 이미지 가져오기
      const vodsWithPosters = await Promise.all(
        rows.map(async (vod) => {
          try {
            const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
              params: {
                api_key: API_KEY,
                query: vod.asset_nm,
                language: 'ko-KR'
              }
            });

            if (response.data.results && response.data.results.length > 0) {
              const movie = response.data.results[0];
              return {
                ...vod,
                poster_path: movie.poster_path ? `${imageUrl}${movie.poster_path}` : null,
                backdrop_path: movie.backdrop_path ? `${imageUrl}${movie.backdrop_path}` : null,
                overview: movie.overview
              };
            }
            return vod;
          } catch (error) {
            console.error('TMDB API 오류:', error);
            return vod;
          }
        })
      );

      return vodsWithPosters;
    } catch (error) {
      throw new Error('장르별 VOD를 가져오는데 실패했습니다: ' + error.message);
    }
  }
}

module.exports = GenreVod;

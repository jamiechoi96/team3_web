const { executeQuery } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class PreferredGenreVod {
  static async getPreferredGenreRecommend(sha2_hash) {
    try {
      // user_genre_preference 테이블에서 선호 장르 VOD 가져오기
      const rows = await executeQuery(`
        SELECT * FROM genre_top20
        WHERE sha2_hash = ?;
      `, [sha2_hash]);

      if (rows.length === 0) {
        console.log('추천할 선호 장르 VOD가 없습니다.');
        return [];
      }

      console.log(`===== 선호 장르 VOD ${rows.length}개 조회 완료 =====`);

      // TMDB API를 사용하여 포스터와 상세 정보 가져오기
      const moviesWithDetails = await Promise.all(
        rows.map(async (movie) => {
          try {
            console.log('검색할 영화 제목:', movie.asset_nm);
            const tmdbResponse = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.asset_nm)}&language=ko-KR`
            );

            if (tmdbResponse.data && Array.isArray(tmdbResponse.data.results) && tmdbResponse.data.results.length > 0) {
              const tmdbMovie = tmdbResponse.data.results[0];
              return {
                ...movie,
                posterUrl: tmdbMovie.poster_path ? `${imageUrl}${tmdbMovie.poster_path}` : null,
                backdropUrl: tmdbMovie.backdrop_path ? `${imageUrl}${tmdbMovie.backdrop_path}` : null,
                overview: tmdbMovie.overview || null
              };
            }

            console.log('TMDB 검색 결과 없음:', movie.asset_nm);
            return {
              ...movie,
              posterUrl: null,
              backdropUrl: null,
              overview: null
            };
          } catch (error) {
            console.error(`TMDB API 오류 (${movie.asset_nm}):`, error.message);
            return {
              ...movie,
              posterUrl: null,
              backdropUrl: null,
              overview: null
            };
          }
        })
      );

      return moviesWithDetails;

    } catch (error) {
      console.error('선호 장르 VOD 조회 오류:', error);
      throw error;
    }
  }
}

module.exports = PreferredGenreVod;

const { executeQuery } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class NewVod {
  static async getNewVods() {
    try {
      console.log('===== 서버: 신작 VOD 데이터 조회 시작 =====');
      
      const rows = await executeQuery(`
        SELECT * FROM new_movie_04_01;
      `);

      console.log('===== 서버: TMDB 데이터 조회 시작 =====');
      
      // TMDB API를 사용하여 포스터와 상세 정보 가져오기
      const moviesWithDetails = await Promise.all(
        rows.map(async (movie) => {
          try {
            const tmdbResponse = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.asset_nm)}&language=ko-KR`
            );

            if (tmdbResponse.data.results && tmdbResponse.data.results.length > 0) {
              const tmdbMovie = tmdbResponse.data.results[0];
              return {
                ...movie,
                posterUrl: tmdbMovie.poster_path ? `${imageUrl}${tmdbMovie.poster_path}` : null,
                backdropUrl: tmdbMovie.backdrop_path ? `${imageUrl}${tmdbMovie.backdrop_path}` : null,
                overview: tmdbMovie.overview
              };
            }
            return movie;
          } catch (error) {
            console.error(`TMDB 검색 오류 (${movie.asset_nm}):`, error);
            return movie;
          }
        })
      );

      console.log('===== 서버: 조회된 신작 VOD =====');
      moviesWithDetails.forEach(vod => {
        console.log(`제목: ${vod.asset_nm}`);
      });
      console.log('===========================');
      
      return moviesWithDetails;

    } catch (error) {
      console.error('신작 VOD 데이터 조회 오류:', error);
      throw error;
    }
  }
}

module.exports = NewVod;

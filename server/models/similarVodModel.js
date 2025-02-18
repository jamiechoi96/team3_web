const { executeQuery } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class SimilarVod {
  static async getSimilarVods(sha2_hash) {
    try {
      // user_based_top20 테이블에서 추천 VOD 가져오기
      const rows = await executeQuery(`
        SELECT * FROM user_based_top20
        where sha2_hash = ?;
      `, [sha2_hash]);

      console.log('===== 추천 VOD 데이터 =====');
      console.log('조회된 VOD 개수:', rows.length);
      console.log('첫 번째 VOD 데이터:', rows[0]);
      console.log('VOD 데이터 필드:', Object.keys(rows[0]));

      // TMDB API를 사용하여 포스터와 상세 정보 가져오기
      const moviesWithDetails = await Promise.all(
        rows.map(async (movie) => {
          try {
            console.log('검색할 영화 제목:', movie.asset_nm);
            const tmdbResponse = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.asset_nm)}&language=ko-KR`
            );

            if (tmdbResponse.data.results && tmdbResponse.data.results.length > 0) {
              //연도가 일치하는 영화 찾기
              const movieYear = movie.crt_yr;
              const matchedMovie = tmdbResponse.data.results.find(result => {
                const releaseYear = result.release_date ? new Date(result.release_date).getFullYear() : null;
                return releaseYear === parseInt(movieYear);
               }) || tmdbResponse.data.results[0]; // 연도가 일치하는 영화가 없으면 첫 번째 결과 사용

              console.log('TMDB 검색 결과:', {
                title: movie.asset_nm,
                year: movie.crt_yr,
                tmdbYear: matchedMovie.release_date ? new Date(matchedMovie.release_date).getFullYear() : null,
                posterPath: matchedMovie.poster_path,
                backdropPath: matchedMovie.backdrop_path
              });

              return {
                ...movie,
                posterUrl: matchedMovie.poster_path ? `${imageUrl}${matchedMovie.poster_path}` : null,
                backdropUrl: matchedMovie.backdrop_path ? `${imageUrl}${matchedMovie.backdrop_path}` : null,
                overview: matchedMovie.overview
              };
            }
            console.log('TMDB 검색 결과 없음:', movie.asset_nm);
            return movie;
          } catch (error) {
            console.error(`TMDB API 오류 (${movie.asset_nm}):`, error.message);
            return movie;
          }
        })
      );

      return moviesWithDetails;

    } catch (error) {
      console.error('추천 VOD 조회 오류:', error);
      throw error;
    }
  }
}

module.exports = SimilarVod;

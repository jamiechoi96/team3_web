const { executeQuery } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class Banner {
  static async getBannerVods() {
    try {
      console.log('===== 배너 VOD 데이터 조회 시작 =====');
      
      // top20 테이블에서 랜덤으로 5개 가져오기
      const rows = await executeQuery(`
        SELECT * FROM vod_movie_rank_04_01
        ORDER BY RAND()
        LIMIT 5;
      `);

      console.log('조회된 배너 VOD 개수:', rows.length);
      if (rows.length > 0) {
        console.log('첫 번째 배너 영화:', rows[0].asset_nm);
      }

      // TMDB API를 사용하여 포스터와 상세 정보 가져오기
      const moviesWithDetails = await Promise.all(
        rows.map(async (movie) => {
          try {
            console.log('영화 검색:', movie.asset_nm);
            const tmdbResponse = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.asset_nm)}&language=ko-KR`
            );

            if (tmdbResponse.data.results && tmdbResponse.data.results.length > 0) {
              const tmdbMovie = tmdbResponse.data.results[0];
              console.log('TMDB 검색 성공:', {
                title: movie.asset_nm,
                posterPath: tmdbMovie.poster_path ? '있음' : '없음',
                backdropPath: tmdbMovie.backdrop_path ? '있음' : '없음'
              });
              return {
                ...movie,
                posterUrl: tmdbMovie.poster_path ? `${imageUrl}${tmdbMovie.poster_path}` : null,
                backdropUrl: tmdbMovie.backdrop_path ? `${imageUrl}${tmdbMovie.backdrop_path}` : null,
                overview: tmdbMovie.overview
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

      console.log('===== 배너 VOD 처리 완료 =====');
      console.log('최종 배너 영화 수:', moviesWithDetails.length);

      return moviesWithDetails;
    } catch (error) {
      console.error('배너 VOD 조회 중 오류:', error);
      throw error;
    }
  }
}

module.exports = Banner;

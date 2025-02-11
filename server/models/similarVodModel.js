const { createConnections } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class SimilarVod {
  static async getSimilarVods(sha2_hash) {
    let connections = null;
    try {
      connections = await createConnections();
      const connection = connections[0];
      
      // user_based_top20 테이블에서 추천 VOD 가져오기
      const [rows] = await connection.execute(`
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
              const tmdbMovie = tmdbResponse.data.results[0];
              console.log('TMDB 검색 결과:', {
                title: movie.asset_nm,
                posterPath: tmdbMovie.poster_path,
                backdropPath: tmdbMovie.backdrop_path
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

      return moviesWithDetails;

    } catch (error) {
      console.error('추천 VOD 조회 오류:', error);
      throw error;
    } finally {
      if (connections) {
        await Promise.all(connections.map(conn => conn.end()));
      }
    }
  }
}

module.exports = SimilarVod;

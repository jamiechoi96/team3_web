const { createConnections } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class SimilarVod {
  static async getSimilarVods() {
    let connections = null;
    try {
      connections = await createConnections();
      const connection = connections[0];
      
      // 시청 기록이 비슷한 사용자들이 본 VOD 가져오기
      const [rows] = await connection.execute(`
        SELECT DISTINCT v.asset_nm, v.genre
        FROM vod_0301 v
        JOIN watch_history_0301 w1 ON v.asset_nm = w1.asset_nm
        JOIN watch_history_0301 w2 ON w1.user_id != w2.user_id
        WHERE w2.user_id IN (
          SELECT w3.user_id
          FROM watch_history_0301 w3
          JOIN watch_history_0301 w4 ON w3.user_id != w4.user_id
          WHERE w3.asset_nm = w4.asset_nm
          GROUP BY w3.user_id
          HAVING COUNT(*) >= 3
        )
        LIMIT 20
      `);

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

      return moviesWithDetails;

    } catch (error) {
      console.error('비슷한 시청 기록 조회 오류:', error);
      throw error;
    } finally {
      if (connections) {
        await Promise.all(connections.map(conn => conn.end()));
      }
    }
  }
}

module.exports = SimilarVod;

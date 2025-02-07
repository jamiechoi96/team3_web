const { createConnections } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class GenreVod {
  static async getGenreVods() {
    let connections = null;
    try {
      connections = await createConnections();
      const connection = connections[0];
      
      // 인기 있는 장르의 VOD 가져오기
      const [rows] = await connection.execute(`
        WITH PopularGenres AS (
          SELECT 
            SUBSTRING_INDEX(SUBSTRING_INDEX(genre, ',', n.n), ',', -1) as single_genre
          FROM 
            vod_0301 v
            CROSS JOIN (
              SELECT 1 as n UNION ALL
              SELECT 2 UNION ALL
              SELECT 3 UNION ALL
              SELECT 4
            ) n
          WHERE 
            CHAR_LENGTH(genre) - CHAR_LENGTH(REPLACE(genre, ',', '')) >= n.n - 1
        ),
        GenreRanking AS (
          SELECT 
            single_genre,
            COUNT(*) as genre_count,
            ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
          FROM 
            PopularGenres
          GROUP BY 
            single_genre
        )
        SELECT DISTINCT 
          v.asset_nm,
          v.genre
        FROM 
          vod_0301 v
          JOIN GenreRanking g ON v.genre LIKE CONCAT('%', g.single_genre, '%')
        WHERE 
          g.rank <= 3
        ORDER BY 
          RAND()
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
      console.error('장르 기반 VOD 조회 오류:', error);
      throw error;
    } finally {
      if (connections) {
        await Promise.all(connections.map(conn => conn.end()));
      }
    }
  }
}

module.exports = GenreVod;

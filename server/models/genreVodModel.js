const { executeQuery } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class GenreVod {
  static async getGenreVods() {
    try {
      // 인기 있는 장르의 VOD 가져오기
      const query = `
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

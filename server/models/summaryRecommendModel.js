const { createConnections } = require('../utils/database');
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const imageUrl = "https://image.tmdb.org/t/p/original";

class SummaryRecommend {
  static async getSummaryRecommend(sha2_hash) {
    let connection = null;
    try {
      // 데이터베이스 연결
      const connections = await createConnections();
      connection = connections[0];

      console.log('받은 sha2_hash:', sha2_hash);

      // smry_recommend 테이블에서 데이터 조회 (해시 기반)
      const [summaryRows] = await connection.execute(`
        SELECT * FROM smry_recommend
        WHERE sha2_hash = ?
        LIMIT 20
      `, [sha2_hash]);

      console.log('줄거리 기반 추천 데이터 조회 결과:', summaryRows);

      // 추천 데이터 선택 로직
      let recommendRows = summaryRows;

      // smry_recommend에 데이터가 없으면 기본 줄거리 데이터 제공
      if (summaryRows.length === 0) {
        const [defaultRows] = await connection.execute(`
          SELECT * FROM smry_recommend
          LIMIT 20
        `);
        recommendRows = defaultRows;
        console.log('기본 줄거리 데이터 조회 결과:', recommendRows);
      }

      // 데이터가 여전히 없으면 사용자의 주요 장르 기반 추천 쿼리
      if (recommendRows.length === 0) {
        const [genreRows] = await connection.execute(`
          WITH UserTopGenre AS (
            SELECT genre, COUNT(*) as genre_count
            FROM (
              SELECT DISTINCT user_id, genre
              FROM watch_history wh
              JOIN vod_movie_03 vm ON wh.vod_id = vm.vod_id
              WHERE user_id = (
                SELECT user_id 
                FROM user_info 
                WHERE sha2_hash = ?
              )
            ) AS UserGenres
            GROUP BY genre
            ORDER BY genre_count DESC
            LIMIT 1
          ),
          TopGenreVods AS (
            SELECT 
              vm.*, 
              COUNT(wh.watch_id) as popularity_score
            FROM 
              vod_movie_03 vm
            LEFT JOIN 
              watch_history wh ON vm.vod_id = wh.vod_id
            JOIN 
              UserTopGenre utg ON vm.genre = utg.genre
            GROUP BY 
              vm.vod_id, vm.asset_nm, vm.genre
            ORDER BY 
              popularity_score DESC
            LIMIT 20
          )
          SELECT * FROM TopGenreVods
        `, [sha2_hash]);

        recommendRows = genreRows;
        console.log('사용자 주요 장르 기반 추천 데이터 조회 결과:', recommendRows);
      }

      // 데이터가 여전히 없으면 랜덤으로 20개 뽑아오기
      if (recommendRows.length === 0) {
        const [randomRows] = await connection.execute(`
          SELECT * FROM vod_movie_03
          ORDER BY RAND()
          LIMIT 20
        `);
        recommendRows = randomRows;
        console.log('랜덤 추천 데이터 조회 결과:', recommendRows);
      }

      // 데이터가 여전히 없으면 빈 배열 반환
      if (recommendRows.length === 0) {
        return {
          success: false,
          message: '추천 데이터가 없습니다.',
          data: []
        };
      }

      // TMDB API로 추가 정보 가져오기
      const moviesWithDetails = await Promise.all(
        recommendRows.map(async (movie) => {
          try {
            const tmdbResponse = await axios.get(
              `https://api.themoviedb.org/3/search/movie`, {
                params: {
                  api_key: API_KEY,
                  query: movie.asset_nm,
                  language: 'ko-KR'
                }
              }
            );

            // TMDB 영화 정보 추출
            if (tmdbResponse.data.results && tmdbResponse.data.results.length > 0) {
              const tmdbMovie = tmdbResponse.data.results[0];
              return {
                ...movie,
                posterUrl: tmdbMovie.poster_path ? `${imageUrl}${tmdbMovie.poster_path}` : null,
                backdropUrl: tmdbMovie.backdrop_path ? `${imageUrl}${tmdbMovie.backdrop_path}` : null,
                overview: tmdbMovie.overview || '상세 정보 없음'
              };
            }

            // TMDB 정보 없을 경우 기본 정보 반환
            return {
              ...movie,
              posterUrl: null,
              backdropUrl: null,
              overview: '영화 정보를 찾을 수 없음'
            };
          } catch (error) {
            console.error(`TMDB API 오류 (${movie.asset_nm}):`, error.message);
            return {
              ...movie,
              posterUrl: null,
              backdropUrl: null,
              overview: '영화 정보를 가져오는 중 오류 발생'
            };
          }
        })
      );

      return {
        success: true,
        data: moviesWithDetails
      };
    } catch (error) {
      console.error('줄거리 기반 추천 조회 중 오류:', error);
      return {
        success: false,
        message: '줄거리 기반 추천 VOD를 가져오는 중 오류가 발생했습니다.',
        data: []
      };
    } finally {
      if (connection) {
        connection.end();
      }
    }
  }

  // 다른 메서드들은 동일한 로직 적용
  static async getAllSummaryRecommends() {
    return this.getSummaryRecommend('');
  }
}

module.exports = SummaryRecommend;

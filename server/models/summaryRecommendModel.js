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

      console.log('===== 줄거리 기반 추천 데이터 조회 시작 =====');
      console.log('요청된 사용자 해시:', sha2_hash);

      // smry_recommend 테이블에서 데이터 조회 (해시 기반)
      const [summaryRows] = await connection.execute(`
        SELECT * FROM smry_recommend
        WHERE sha2_hash = ?
        LIMIT 20;
      `, [sha2_hash]);

      console.log('===== 줄거리 기반 추천 데이터 조회 결과 =====');
      console.log('조회된 영화 개수:', summaryRows.length);
      if (summaryRows.length > 0) {
        console.log('첫 번째 추천 영화:', summaryRows[0].asset_nm);
        console.log('데이터 필드:', Object.keys(summaryRows[0]));
      }

      // 추천 데이터 선택 로직
      let recommendRows = summaryRows;

      // smry_recommend에 데이터가 없으면 null 반환
      if (summaryRows.length === 0) {
        console.log('===== 줄거리 기반 추천 데이터 없음 =====');
        return [];
      }

      console.log('===== TMDB 데이터 조회 시작 =====');
      // TMDB API로 추가 정보 가져오기
      const moviesWithDetails = await Promise.all(
        recommendRows.map(async (movie) => {
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

      console.log('===== 줄거리 기반 추천 처리 완료 =====');
      console.log('최종 추천 영화 수:', moviesWithDetails.length);

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

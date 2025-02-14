const { executeQuery } = require('../utils/database');

class Top20 {
  static async getTop20() {
    try {
      console.log('===== 서버: TOP 20 데이터 조회 시작 =====');
      
      const rows = await executeQuery(`
        SELECT 
          ranking,
          asset_nm,
          popularity
        FROM
          vod_movie_rank_04_01
        LIMIT 20
      `);

      console.log('===== 서버: 조회된 데이터 =====');
      rows.forEach(movie => {
        console.log(`순위: ${movie.ranking} | 제목: ${movie.asset_nm} | 인기도: ${movie.popularity}`);
      });
      console.log('===========================');
      
      return rows;

    } catch (error) {
      console.error('TOP 20 데이터 조회 오류:', error);
      throw error;
    }
  }
}

module.exports = Top20;
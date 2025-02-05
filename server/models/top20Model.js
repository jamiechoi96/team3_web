const { createConnections } = require('../utils/database');

class Top20 {
  static async getTop20() {
    let connections = null;
    try {
      connections = await createConnections();
      
      // 105 DB만 사용 (첫 번째 연결)
      const connection = connections[0];
      console.log('===== 서버: TOP 20 데이터 조회 시작 =====');
      const [rows] = await connection.execute(`

        WITH WeekData AS (
          SELECT 
            REGEXP_REPLACE(asset_nm, '\\\\(.*?\\\\)', '') AS asset_nm,
            COUNT(*) AS popularity
          FROM vod_movie_04
          WHERE SUBSTRING(strt_dt, 1, 6) = '202304'
          AND SUBSTRING(strt_dt, 7, 2) >= '25' 
          GROUP BY REGEXP_REPLACE(asset_nm, '\\\\(.*?\\\\)', '')
        )
        SELECT 
          asset_nm,
          popularity,
          RANK() OVER (ORDER BY popularity DESC) AS \`rank\`
        FROM WeekData
        LIMIT 20
        
      `);
      
      console.log('===== 서버: 조회된 데이터 =====');
      rows.forEach(movie => {
        console.log(`순위: ${movie.rank} | 제목: ${movie.asset_nm} | 인기도: ${movie.popularity}`);
      });
      console.log('===========================');
      
      return rows;

    } catch (error) {
      console.error('TOP 20 데이터 조회 오류:', error);
      throw error;
    } finally {
      if (connections) {
        await Promise.all(connections.map(conn => conn.end()));
      }
    }
  }
}

module.exports = Top20;

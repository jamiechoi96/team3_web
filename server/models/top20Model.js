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
        SELECT 
          ranking,
          asset_nm,
          popularity
        FROM
          vod_popularity_04
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
    } finally { 
      if (connections) {
        await Promise.all(connections.map(conn => conn.end()));
      } 
    }
  }
}

module.exports = Top20;
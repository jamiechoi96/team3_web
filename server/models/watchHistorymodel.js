const { createConnections } = require('../utils/database');

class WatchHistory {
  static async getWatchHistory(userHash) {
    let connections = null;
    try {
      connections = await createConnections();
      // 첫 번째 데이터베이스 연결 사용
      const connection = connections[0];
      
      const [rows] = await connection.execute(`
        WITH RankedContent AS (
          SELECT 
            sha2_hash,
            category,
            latest_strt_dt,
            total_use_tms,
            latest_episode
          FROM 
            vod_movie_09
          WHERE 
            sha2_hash = ?
        )
        SELECT * FROM RankedContent
        ORDER BY latest_strt_dt DESC
        LIMIT 5;
      `, [userHash]);
      
      return rows;
    } catch (error) {
      console.error('데이터베이스 쿼리 오류:', error);
      throw error;
    } finally {
      if (connections) {
        try {
          await Promise.all(connections.map(conn => conn.end()));
        } catch (error) {
          console.error('데이터베이스 연결 종료 오류:', error);
        }
      }
    }
  }
}

module.exports = WatchHistory;

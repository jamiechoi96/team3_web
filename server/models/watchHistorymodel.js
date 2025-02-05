const { createConnections } = require('../utils/database');

class WatchHistory {
  static async getWatchHistory(userHash) {
    console.log('watchHistoryModel에서 userHash 확인 중...');
    if (!userHash) {
      console.log('watchHistoryModel에서 userHash가 없습니다.');
      console.error('[Watch History Model] userHash가 없습니다.');
      throw new Error('userHash가 필요합니다. 사용자 정보를 확인해주세요.');
    }

    let connections = null;
    try {
      connections = await createConnections();
      // 115db사용 (최근 시청 기록)
      const connection = connections[1];
      
      const [rows] = await connection.execute(`
        WITH RankedContent AS (
          SELECT 
            sha2_hash,
            category,
            latest_strt_dt,
            total_use_tms,
            latest_episode
          FROM 
            vod_movie_04
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

const { executeQuery } = require('../utils/database');

class WatchHistory {
  static async getWatchHistory(userHash) {
    console.log('watchHistoryModel에서 userHash 확인 중...');
    if (!userHash) {
      console.log('watchHistoryModel에서 userHash가 없습니다.');
      console.error('[Watch History Model] userHash가 없습니다.');
      throw new Error('userHash가 필요합니다. 사용자 정보를 확인해주세요.');
    }

    try {
      const rows = await executeQuery(`
        WITH RankedContent AS (
          SELECT 
            sha2_hash,
            category,
            latest_strt_dt,
            total_use_tms,
            latest_episode
          FROM 
            vod_movie_03
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
    }
  }
}

module.exports = WatchHistory;

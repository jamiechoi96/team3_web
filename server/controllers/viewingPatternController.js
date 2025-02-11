const { createConnections } = require('../utils/database');

const getViewingPatterns = async (req, res) => {
  let connections = null;
  try {
    const userHash = req.user.sha2_hash;
    
    connections = await createConnections();
    const connection = connections[0];

    // 선호 시청 시간대 분석
    const [timePeriodStats] = await connection.execute(`
      SELECT 
        CASE 
          WHEN HOUR(STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')) BETWEEN 0 AND 5 THEN '새벽'
          WHEN HOUR(STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')) BETWEEN 6 AND 11 THEN '오전'
          WHEN HOUR(STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')) BETWEEN 12 AND 17 THEN '오후'
          ELSE '저녁'
        END as time_period,
        COUNT(*) as count
      FROM vod_movie_03
      WHERE sha2_hash = ?
      GROUP BY time_period
      ORDER BY count DESC
      LIMIT 1
    `, [userHash]);

    // 시간대별 시청 횟수
    const [hourlyStats] = await connection.execute(`
      SELECT 
        HOUR(STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')) as hour,
        COUNT(*) as count
      FROM vod_movie_03
      WHERE sha2_hash = ?
      GROUP BY hour
      ORDER BY hour
    `, [userHash]);

    // 연속 시청(몰아보기) 분석
    const [bingeStats] = await connection.execute(`
      WITH viewing_sessions AS (
        SELECT 
          strt_dt,
          LAG(strt_dt) OVER (ORDER BY strt_dt) as prev_strt_dt
        FROM vod_movie_03
        WHERE sha2_hash = ?
      )
      SELECT 
        COUNT(*) as binge_count,
        COUNT(*) * 100.0 / (
          SELECT COUNT(*) 
          FROM vod_movie_03 
          WHERE sha2_hash = ?
        ) as binge_percentage
      FROM viewing_sessions
      WHERE 
        TIMESTAMPDIFF(
          MINUTE, 
          STR_TO_DATE(prev_strt_dt, '%Y%m%d%H%i%s'),
          STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')
        ) <= 30
    `, [userHash, userHash]);

    // 24시간 배열 생성 (데이터가 없는 시간대는 0으로 설정)
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }));

    // 실제 데이터로 업데이트
    hourlyStats.forEach(stat => {
      hourlyData[stat.hour].count = stat.count;
    });

    res.json({
      preferredTimePeriod: timePeriodStats[0] || { time_period: '데이터 없음', count: 0 },
      bingeWatching: bingeStats[0] || { binge_count: 0, binge_percentage: 0 },
      hourlyStats: hourlyData
    });
  } catch (error) {
    console.error('시청 패턴 조회 에러:', error);
    res.status(500).json({ message: '시청 패턴을 가져오는 중 오류가 발생했습니다.' });
  } finally {
    if (connections) {
      try {
        await Promise.all(connections.map(conn => conn.end()));
      } catch (error) {
        console.error('데이터베이스 연결 종료 오류:', error);
      }
    }
  }
};

module.exports = {
  getViewingPatterns
};

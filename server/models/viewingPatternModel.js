const { executeQuery, createConnections } = require('../utils/database');

class ViewingPatternModel {
    static async getViewingPatternsByUser(userHash) {
        let connections = null;
        try {
            connections = await createConnections();
            const connection = connections[0];

            const [timePeriodStats] = await connection.execute(
                `SELECT 
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
                LIMIT 1`,
                [userHash]
            );

            const [hourlyStats] = await connection.execute(
                `SELECT 
                    HOUR(STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')) as hour,
                    COUNT(*) as count
                FROM vod_movie_03
                WHERE sha2_hash = ?
                GROUP BY hour
                ORDER BY hour`,
                [userHash]
            );

            const [bingeStats] = await connection.execute(
                `WITH viewing_sessions AS (
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
                WHERE TIMESTAMPDIFF(MINUTE, 
                    STR_TO_DATE(prev_strt_dt, '%Y%m%d%H%i%s'),
                    STR_TO_DATE(strt_dt, '%Y%m%d%H%i%s')) <= 30`,
                [userHash, userHash]
            );

            // 24시간 배열 생성 (데이터가 없는 시간대는 0으로 설정)
            const hourlyData = Array.from({ length: 24 }, (_, i) => ({
                hour: i,
                count: 0
            }));

            // 실제 데이터로 업데이트
            hourlyStats.forEach(stat => {
                hourlyData[stat.hour].count = stat.count;
            });

            return {
                preferredTimePeriod: timePeriodStats[0] || { time_period: '데이터 없음', count: 0 },
                bingeWatching: bingeStats[0] || { binge_count: 0, binge_percentage: 0 },
                hourlyStats: hourlyData
            };
        } catch (error) {
            throw new Error('시청 패턴을 가져오는데 실패했습니다: ' + error.message);
        } finally {
            if (connections) {
                connections.forEach(conn => conn.end());
            }
        }
    }
}

module.exports = ViewingPatternModel;

const { executeQuery, createConnections } = require('../utils/database');

class ViewingPatternModel {
    static async getViewingPatternsByUser(userHash) {
        let connections = null;
        try {
            connections = await createConnections();
            const connection = connections[0];

            // 인위적인 지연 추가 (1000ms)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const [timePeriodStats] = await connection.execute(
                `SELECT 
                    time_period,
                    COUNT(*) as count
                FROM user_viewing_patterns
                WHERE sha2_hash = ?
                GROUP BY time_period
                ORDER BY count DESC
                LIMIT 1`,
                [userHash]
            );

            const [hourlyStats] = await connection.execute(
                `SELECT 
                    viewing_hour as hour,
                    COUNT(*) as count
                FROM user_viewing_patterns
                WHERE sha2_hash = ?
                GROUP BY viewing_hour
                ORDER BY viewing_hour`,
                [userHash]
            );

            const [bingeStats] = await connection.execute(
                `SELECT 
                    COUNT(*) as binge_count,
                    COUNT(*) * 100.0 / (
                        SELECT COUNT(*) 
                        FROM user_viewing_patterns 
                        WHERE sha2_hash = ?
                    ) as binge_percentage
                FROM user_viewing_patterns
                WHERE sha2_hash = ?
                AND next_view_interval <= 30`,
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

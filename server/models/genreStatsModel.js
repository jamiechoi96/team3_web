const { executeQuery } = require('../utils/database');

class GenreStatsModel {
    static async getGenreStatsByUser(userHash) {
        try {
            // 인위적인 지연 추가 (1000ms)
            await new Promise(resolve => setTimeout(resolve, 500));

            const query = `
                WITH Total AS (
                    SELECT COUNT(*) AS total_assets
                    FROM user_viewing_patterns
                    WHERE sha2_hash = ?
                ),
                GenreCounts AS (
                    SELECT 
                        genre_of_ct_cl,                        
                        COUNT(*) AS asset_count,               
                        ROUND((COUNT(*) * 100.0) / (SELECT total_assets FROM Total), 1) AS percentage
                    FROM user_viewing_patterns
                    WHERE sha2_hash = ?
                    GROUP BY genre_of_ct_cl
                ),
                TopGenres AS (
                    SELECT genre_of_ct_cl, asset_count, percentage
                    FROM GenreCounts
                    ORDER BY percentage DESC
                    LIMIT 5
                )
                SELECT 
                    COALESCE(t.genre_of_ct_cl, '기타') AS genre,
                    SUM(gc.asset_count) AS total_asset_count,
                    ROUND(SUM(gc.percentage), 1) AS total_percentage
                FROM GenreCounts gc
                LEFT JOIN TopGenres t ON gc.genre_of_ct_cl = t.genre_of_ct_cl
                GROUP BY 
                    CASE WHEN t.genre_of_ct_cl IS NULL THEN '기타' ELSE t.genre_of_ct_cl END
                ORDER BY 
                    CASE WHEN genre = '기타' THEN 1 ELSE 0 END, 
                    total_percentage DESC;
            `;

            return await executeQuery(query, [userHash, userHash]);
        } catch (error) {
            throw new Error('장르 통계를 가져오는데 실패했습니다: ' + error.message);
        }
    }
}

module.exports = GenreStatsModel;

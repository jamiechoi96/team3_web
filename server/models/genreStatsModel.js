const { executeQuery } = require('../utils/database');

class GenreStatsModel {
    static async getGenreStatsByUser(userHash) {
        try {
            const query = `
                WITH Total AS (
                    SELECT COUNT(asset) AS total_assets
                    FROM vod_movie_03
                    WHERE sha2_hash = ?
                ),
                GenreCounts AS (
                    SELECT 
                        genre_of_ct_cl,                        
                        COUNT(asset) AS asset_count,               
                        ROUND((COUNT(asset) * 100.0) / total.total_assets, 1) AS percentage
                    FROM vod_movie_03, Total
                    WHERE sha2_hash = ?
                    GROUP BY genre_of_ct_cl, total.total_assets
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
                GROUP BY genre
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

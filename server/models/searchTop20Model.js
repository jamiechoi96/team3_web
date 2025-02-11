const { createConnections } = require('../utils/database');
const axios = require('axios');
require('dotenv').config();

class SearchTop20 {
    static async getSearchTop20() {
        let connections = null;
        try {
            connections = await createConnections();
            
            // 105 DB만 사용 (첫 번째 연결)
            const connection = connections[0];
            console.log('=== 서치 TOP 20 데이터 조회 시작 - model ===');

            const query = `
                SELECT 
                    ranking,
                    asset_nm,
                    popularity
                FROM
                    vod_movie_rank_04_01
                LIMIT 20
            `;

            const [results] = await connection.query(query);

            // TMDB API를 통해 추가 정보 가져오기
            const tmdbApiKey = process.env.TMDB_API_KEY;
            const enrichedResults = await Promise.all(
                results.map(async (movie) => {
                    try {
                        // 영화 검색
                        const searchResponse = await axios.get(
                            `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(movie.asset_nm)}&language=ko-KR`
                        );

                        if (searchResponse.data.results && searchResponse.data.results.length > 0) {
                            const tmdbMovie = searchResponse.data.results[0];
                            return {
                                ...movie,
                                posterUrl: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null,
                                backdropUrl: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : null,
                                overview: tmdbMovie.overview,
                                tmdb_id: tmdbMovie.id
                            };
                        }
                        return movie;
                    } catch (error) {
                        console.error(`TMDB API 오류 (${movie.asset_nm}):`, error.message);
                        return movie;
                    }
                })
            );

            if (enrichedResults.length > 0) {
                console.log('=== 서치 TOP 20 데이터 조회 성공 - model ===');
                return {
                    success: true,
                    data: enrichedResults
                };
            } else {
                console.log('=== 서치 TOP 20 데이터 없음 - model ===');
                return {
                    success: false,
                    error: '데이터가 없습니다.'
                };
            }
        } catch (error) {
            console.error('서치 TOP 20 모델 오류:', error);
            return {
                success: false,
                error: error.message
            };
        } finally {
            if (connections) {
                connections.forEach(conn => conn.end());
            }
        }
    }
}

module.exports = SearchTop20;

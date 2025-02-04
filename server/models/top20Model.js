const mysql = require('mysql2/promise');
const dbConfigs = require('../config/database');

async function getTop20() {
  // 105db만 사용 (첫 번째 연결)
  const config = dbConfigs[0];
  const connection = await mysql.createConnection(config);

  console.log('===== 서버: TOP 20 데이터 조회 시작 =====');
  const [rows] = await connection.execute(`
    WITH WeekData AS (
      SELECT 
        REGEXP_REPLACE(asset_nm, '\\\\(.*?\\\\)', '') AS asset_nm,
        COUNT(*) AS popularity
      FROM vod_movie_10
      WHERE SUBSTRING(strt_dt, 1, 6) = '202310'
      AND SUBSTRING(strt_dt, 7, 2) >= '25'
      GROUP BY REGEXP_REPLACE(asset_nm, '\\\\(.*?\\\\)', '')
    )
    SELECT 
      asset_nm,
      popularity,
      RANK() OVER (ORDER BY popularity DESC) AS \`rank\`
    FROM WeekData
    LIMIT 20
  `);

  console.log('===== 서버: 조회된 데이터 =====');
  rows.forEach(movie => {
    console.log(movie);
    // console.log(`${movie.rank}위: ${movie.asset_nm} | 인기도: ${movie.popularity}`);
  });
  console.log('===========================');

  await connection.end();
  return rows;
}

module.exports = { getTop20 };
const GenreStatsModel = require('../models/genreStatsModel');

const getGenreStats = async (req, res) => {
  try {
    const userHash = req.user.sha2_hash;
    const genreStats = await GenreStatsModel.getGenreStatsByUser(userHash);

    // 로그 출력
    console.log('\n============ 장르 통계 결과 ============');
    console.log(`▶ 사용자 해시: ${userHash}`);
    
    console.log('\n▶ 장르별 시청 통계 (TOP 5)');
    const totalWatched = genreStats.reduce((sum, item) => sum + parseInt(item.total_asset_count), 0);
    
    genreStats.slice(0, 5).forEach(stat => {
      const percentage = ((parseInt(stat.total_asset_count) / totalWatched) * 100).toFixed(1);
      console.log(`   - ${stat.genre.padEnd(15)}: ${stat.total_asset_count}개 (${percentage}%)`);
    });

    console.log('\n▶ 전체 시청 통계');
    console.log(`   - 총 시청 콘텐츠: ${totalWatched}개`);
    console.log(`   - 시청 장르 수: ${genreStats.length}개`);
    console.log('========================================\n');

    res.json(genreStats);
  } catch (error) {
    console.error('장르 통계 조회 에러:', error);
    res.status(500).json({ message: '장르 통계를 가져오는 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  getGenreStats
};

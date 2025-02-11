const ViewingPatternModel = require('../models/viewingPatternModel');

const getViewingPatterns = async (req, res) => {
  try {
    const userHash = req.user.sha2_hash;
    const viewingPatterns = await ViewingPatternModel.getViewingPatternsByUser(userHash);
    
    // 로그 출력
    console.log('\n============ 사용자 분석 결과 ============');
    console.log(`▶ 사용자 해시: ${userHash}`);
    
    console.log('\n▶ 선호 시청 시간대');
    console.log(`   - 시간대: ${viewingPatterns.preferredTimePeriod?.time_period || '데이터 없음'}`);
    console.log(`   - 시청 횟수: ${viewingPatterns.preferredTimePeriod?.count || 0}회`);
    
    console.log('\n▶ 몰아보기 성향');
    console.log(`   - 30분 이내 재시청: ${viewingPatterns.bingeWatching?.binge_count || 0}회`);
    console.log(`   - 몰아보기 비율: ${Math.round(viewingPatterns.bingeWatching?.binge_percentage || 0)}%`);
    
    console.log('\n▶ 시간대별 시청 패턴 (TOP 5)');
    const hourlyStats = viewingPatterns.hourlyStats
      .filter(stat => stat.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    if (hourlyStats.length > 0) {
      hourlyStats.forEach(stat => {
        console.log(`   - ${String(stat.hour).padStart(2, '0')}시: ${stat.count}회`);
      });
    } else {
      console.log('   데이터 없음');
    }
    console.log('========================================\n');

    res.json({
      preferredTimePeriod: viewingPatterns.preferredTimePeriod,
      bingeWatching: viewingPatterns.bingeWatching,
      hourlyStats: viewingPatterns.hourlyStats
    });
  } catch (error) {
    console.error('시청 패턴 조회 에러:', error);
    res.status(500).json({ message: '시청 패턴을 가져오는 중 오류가 발생했습니다.' });
  }
};

module.exports = {
  getViewingPatterns
};

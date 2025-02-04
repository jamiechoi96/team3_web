const watchHistory = require('../models/watchHistorymodel');

async function getWatchHistory(req, res) {
  try {
    const { userHash } = req.query;
    console.log('요청된 userHash:', userHash);

    if (!userHash) {
      console.log('userHash가 없음');
      return res.status(400).json({ error: "userHash가 필요합니다" });
    }
    
    console.log('시청 기록 조회 시작...');
    const history = await watchHistory.getWatchHistory(userHash);
    console.log('조회된 시청 기록:', JSON.stringify(history, null, 2));
    
    res.json(history);
  } catch (error) {
    console.error('시청 기록 조회 오류:', error);
    res.status(500).json({
      오류: "데이터베이스 쿼리 오류",
      상세: error.message
    });
  }
}

module.exports = {
  getWatchHistory
};

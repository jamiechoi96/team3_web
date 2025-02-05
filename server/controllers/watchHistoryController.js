const watchHistory = require('../models/watchHistoryModel');
const jwt = require('jsonwebtoken');

async function getWatchHistory(req, res) {
  try {
    console.log('서버에서 요청이 도착했습니다.');
    console.log('서버에서 요청이 도착했습니다. 요청 확인 중...');
    console.log('시청 기록 조회 요청 수신.');
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: '토큰이 필요합니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lghellovisionvodteam3');
    const userHash = decoded.sha2_hash;

    console.log('요청된 userHash:', userHash);

    if (!userHash) {
      console.warn('[Watch History Controller] userHash가 없습니다.');
      return res.status(400).json({ 
          success: false,
          message: 'userHash가 필요합니다. 서버에서 userHash를 가져올 수 없습니다.' 
      });
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

// This file is renamed to watchHistoryRoute.js
const express = require('express');
const router = express.Router();
const { getWatchHistory } = require('../controllers/watchHistoryController');
const { getTop20 } = require('../controllers/top20Controller');

// 테스트
router.get('/test', (req, res) => {
  res.json({ message: "백엔드 서버가 실행 중입니다!" });
});

// 시청기록 조회
router.get('/watch-history', getWatchHistory);

// TOP 20 영화 순위 조회
router.get('/top20', getTop20);

module.exports = router;

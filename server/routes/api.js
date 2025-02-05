// This file is renamed to watchHistoryRoute.js
const express = require('express');
const router = express.Router();
const { getWatchHistory } = require('../controllers/watchHistoryController');
const { getTop20 } = require('../controllers/top20Controller');
const authController = require('../controllers/authController');

// 테스트
router.get('/test', (req, res) => {
  res.json({ message: "백엔드 서버가 실행 중입니다!" });
});

// 시청기록 조회
router.get('/watch-history', getWatchHistory);

// TOP 20 영화 순위 조회
router.get('/top20', getTop20);

// 로그인 라우트
router.post('/auth/login', authController.login);

// 보호된 라우트 예시
router.get('/auth/protected', authController.authenticateToken, (req, res) => {
    res.json({ message: '인증된 사용자입니다.', user: req.user });
});

module.exports = router;

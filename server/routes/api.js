const express = require('express');
const router = express.Router();
const { getWatchHistory } = require('../controllers/watchHistoryController');
const { getTop20 } = require('../controllers/top20Controller');
const newVodController = require('../controllers/newVodController');
const authController = require('../controllers/authController');
const similarVodController = require('../controllers/similarVodController');
const { getGenreStats } = require('../controllers/genreStatsController');

// 테스트
router.get('/test', (req, res) => {
  res.json({ message: "백엔드 서버가 실행 중입니다!" });
});

// TOP 20 영화 순위 조회
router.get('/top20', getTop20);

// VOD 추천 조회
router.get('/new-vods', newVodController.getNewVods);
router.post('/similar-vods', authController.authenticateToken, similarVodController.getSimilarVods);
router.get('/genre-vods', newVodController.getGenreVods);

// 로그인 라우트
router.post('/auth/login', authController.login);

// 시청기록 조회 (보호된 라우트)
router.get('/watch-history', authController.authenticateToken, getWatchHistory);

// 장르 통계 조회 (보호된 라우트)
router.get('/genre-stats', authController.authenticateToken, getGenreStats);

module.exports = router;
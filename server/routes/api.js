const express = require('express');
const router = express.Router();
const { getWatchHistory } = require('../controllers/watchHistoryController');
const { getTop20 } = require('../controllers/top20Controller');
const { getSearchTop20 } = require('../controllers/searchTop20Controller');
const newVodController = require('../controllers/newVodController');
const authController = require('../controllers/authController');
const similarVodController = require('../controllers/similarVodController');
const genreVodController = require('../controllers/genreVodController');
const { getGenreStats } = require('../controllers/genreStatsController');
const { getViewingPatterns } = require('../controllers/viewingPatternController');
const summaryRecommendController = require('../controllers/summaryRecommendController');

// 테스트
router.get('/test', (req, res) => {
  res.json({ message: "백엔드 서버가 실행 중입니다!" });
});

// TOP 20 관련 라우트
router.get('/top20', getTop20);
router.get('/search-top20', getSearchTop20);

// VOD 추천 조회
router.get('/new-vods', newVodController.getNewVods);
router.post('/similar-vods', authController.authenticateToken, similarVodController.getSimilarVods);
router.get('/genre-vods', authController.authenticateToken, genreVodController.getGenreVods);

// 로그인 라우트
router.post('/auth/login', authController.login);

// 시청기록 조회 (보호된 라우트)
router.get('/watch-history', authController.authenticateToken, getWatchHistory);

// 장르 통계 조회 (보호된 라우트)
router.get('/genre-stats', authController.authenticateToken, getGenreStats);

// 시청 패턴 분석 (보호된 라우트)
router.get('/viewing-patterns', authController.authenticateToken, getViewingPatterns);

// 줄거리 기반 추천 관련 라우트
router.get('/summary-recommend/:sha2Hash', authController.authenticateToken, summaryRecommendController.getSummaryRecommend);
router.get('/summary-recommend', authController.authenticateToken, summaryRecommendController.getAllSummaryRecommends);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getWatchHistory } = require('../controllers/watchHistoryController');
const { getTop20 } = require('../controllers/top20Controller');
const { getSearchTop20 } = require('../controllers/searchTop20Controller');
const newVodController = require('../controllers/newVodController');
const authController = require('../controllers/authController');
const similarVodController = require('../controllers/similarVodController');
const { getGenreStats } = require('../controllers/genreStatsController');
const { getViewingPatterns } = require('../controllers/viewingPatternController');
const summaryRecommendController = require('../controllers/summaryRecommendController');
const bannerController = require('../controllers/bannerController');
const preferredGenreController = require("../controllers/preferredGenreController");

// 테스트
router.get('/test', (req, res) => {
  res.json({ message: "백엔드 서버가 실행 중입니다!" });
});

// TOP 20 관련 라우트
router.get('/top20', getTop20);
router.get('/search-top20', getSearchTop20);

// 로그인 라우트
router.post('/auth/login', authController.login);

// 신작 추천 조회
router.get('/new-vods', newVodController.getNewVods);

// 협업필터링
router.get('/similar-vods', authController.authenticateToken, similarVodController.getSimilarVods);

// 시청기록 조회 (보호된 라우트)
router.get('/watch-history', authController.authenticateToken, getWatchHistory);

// 장르 통계 조회 (보호된 라우트)
router.get('/genre-stats', authController.authenticateToken, getGenreStats);

// 시청 패턴 분석 (보호된 라우트)
router.get('/viewing-patterns', authController.authenticateToken, getViewingPatterns);

// 줄거리 기반 추천 관련 라우트
router.get('/summary-recommend', authController.authenticateToken, summaryRecommendController.getSummaryRecommend);


// 배너 VOD 조회
router.get('/banner-vods', bannerController.getBannerVods);

// 사용자의 선호 장르 기반 추천 VOD 가져오기
router.get("/preferred-genre", authController.authenticateToken, preferredGenreController.getPreferredGenreRecommend);



module.exports = router;
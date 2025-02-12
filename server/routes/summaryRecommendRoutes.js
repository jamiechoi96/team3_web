const express = require("express");
const router = express.Router();
const summaryRecommendController = require("../controllers/summaryRecommendController");

// 특정 콘텐츠의 줄거리 기반 추천 목록 조회
router.get("/:sha2Hash", summaryRecommendController.getSummaryRecommend);

// 전체 줄거리 기반 추천 목록 조회
router.get("/", summaryRecommendController.getAllSummaryRecommends);

module.exports = router;

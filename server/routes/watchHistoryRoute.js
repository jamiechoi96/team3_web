// This file is renamed to watchHistoryRoute.js
const express = require('express');
const router = express.Router();
const { getWatchHistory } = require('../controllers/watchHistoryController');

router.get('/watch-history', getWatchHistory);
router.get('/test', (req, res) => {
  res.json({ message: "백엔드 서버가 실행 중입니다!" });
});

module.exports = router;

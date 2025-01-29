// This file is renamed to top20Route.js
const express = require('express');
const router = express.Router();
const { getTop20 } = require('../controllers/top20Controller');

router.get('/top20', getTop20);

module.exports = router;

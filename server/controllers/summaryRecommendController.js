const SummaryRecommend = require("../models/summaryRecommendModel");

const summaryRecommendController = {
  getSummaryRecommend: async (req, res) => {
    try {
      // JWT 토큰에서 sha2_hash 가져오기
      const sha2_hash = req.user.sha2_hash;
      
      if (!sha2_hash) {
        return res.status(400).json({ 
          success: false, 
          message: '사용자 해시가 필요합니다.' 
        });
      }

      const result = await SummaryRecommend.getSummaryRecommend(sha2_hash);
      res.json(result);
    } catch (error) {
      console.error("Error in getSummaryRecommend:", error);
      res.status(500).json({ 
        success: false,
        message: "내부 서버 오류" 
      });
    }
  },

  getAllSummaryRecommends: async (req, res) => {
    try {
      const result = await SummaryRecommend.getAllSummaryRecommends();
      res.json(result);
    } catch (error) {
      console.error("Error in getAllSummaryRecommends:", error);
      res.status(500).json({ 
        success: false,
        message: "내부 서버 오류" 
      });
    }
  }
};

module.exports = summaryRecommendController;

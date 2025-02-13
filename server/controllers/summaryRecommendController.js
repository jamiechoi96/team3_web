const SummaryRecommend = require("../models/summaryRecommendModel");

const summaryRecommendController = {
  getSummaryRecommend: async (req, res) => {
    try {
      const { sha2Hash } = req.params;
      const result = await SummaryRecommend.getSummaryRecommend(sha2Hash);
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

const summaryRecommendModel = require("../models/summaryRecommendModel");

const summaryRecommendController = {
  getSummaryRecommend: async (req, res) => {
    try {
      const { sha2Hash } = req.params;
      const result = await summaryRecommendModel.getSummaryRecommend(sha2Hash);
      res.json(result);
    } catch (error) {
      console.error("Error in getSummaryRecommend:", error);
      res.status(500).json({ error: "내부 서버 오류" });
    }
  },

  getAllSummaryRecommends: async (req, res) => {
    try {
      const result = await summaryRecommendModel.getAllSummaryRecommends();
      res.json(result);
    } catch (error) {
      console.error("Error in getAllSummaryRecommends:", error);
      res.status(500).json({ error: "내부 서버 오류" });
    }
  }
};

module.exports = summaryRecommendController;

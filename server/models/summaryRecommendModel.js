const pool = require("../config/database");

const summaryRecommendModel = {
  getSummaryRecommend: async (sha2Hash) => {
    try {
      const [rows] = await pool.query(
        `SELECT sha2_hash, asset_nm 
         FROM smry_recommend 
         WHERE sha2_hash = ?`,
        [sha2Hash]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getAllSummaryRecommends: async () => {
    try {
      const [rows] = await pool.query(
        `SELECT sha2_hash, asset_nm 
         FROM smry_recommend`
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = summaryRecommendModel;

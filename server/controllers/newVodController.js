const NewVod = require('../models/newVodModel');
const SimilarVod = require('../models/similarVodModel');
const GenreVod = require('../models/genreVodModel');

const newVodController = {
  getNewVods: async (req, res) => {
    try {
      const newVods = await NewVod.getNewVods();
      res.json({ success: true, data: newVods });
    } catch (error) {
      console.error('신작 VOD 조회 중 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
  }

  
};

module.exports = newVodController;

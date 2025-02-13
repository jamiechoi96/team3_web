const Banner = require('../models/bannerModel');

const bannerController = {
  getBannerVods: async (req, res) => {
    try {
      const bannerVods = await Banner.getBannerVods();
      res.json({ success: true, data: bannerVods });
    } catch (error) {
      console.error('배너 VOD 조회 중 오류:', error);
      res.status(500).json({ 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      });
    }
  }
};

module.exports = bannerController;

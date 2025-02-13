const SimilarVod = require('../models/similarVodModel');

exports.getSimilarVods = async (req, res) => {
  try {
    // req.user에서 sha2_hash를 가져옵니다
    const sha2_hash = req.user.sha2_hash;
    
    if (!sha2_hash) {
      return res.status(400).json({ 
        success: false, 
        message: '사용자 해시가 필요합니다.' 
      });
    }

    const similarVods = await SimilarVod.getSimilarVods(sha2_hash);
    res.json({ success: true, data: similarVods });
  } catch (error) {
    console.error('비슷한 VOD 조회 중 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

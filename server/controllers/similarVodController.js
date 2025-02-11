const SimilarVod = require('../models/similarVodModel');

exports.getSimilarVods = async (req, res) => {
    try {
        // body 대신 req.user에서 sha2_hash를 가져옵니다
        const sha2_hash = req.user.sha2_hash;
        console.log('컨트롤러에서 받은 sha2_hash:', sha2_hash);
        
        if (!sha2_hash) {
            return res.status(400).json({ 
                success: false, 
                message: '사용자 해시가 필요합니다.' 
            });
        }

        const similarVods = await SimilarVod.getSimilarVods(sha2_hash);
        console.log('조회된 VOD 개수:', similarVods.length);
        
        res.json({
            success: true,
            data: similarVods
        });
        
    } catch (error) {
        console.error('추천 VOD 조회 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '추천 VOD를 가져오는 중 오류가 발생했습니다.',
            error: error.message 
        });
    }
};

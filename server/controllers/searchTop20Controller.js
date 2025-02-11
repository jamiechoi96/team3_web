const SearchTop20 = require('../models/searchTop20Model');

const getSearchTop20 = async (req, res) => {
    try {
        console.log('=== 서치 TOP 20 데이터 요청 시작 - server ===');
        const top20Data = await SearchTop20.getSearchTop20();
        
        if (top20Data.success) {
            console.log('=== 서치 TOP 20 데이터 조회 성공 ===');
            return res.status(200).json({
                success: true,
                data: top20Data.data
            });
        } else {
            console.error('서치 TOP 20 데이터 조회 실패:', top20Data.error);
            return res.status(400).json({
                success: false,
                message: top20Data.error
            });
        }
    } catch (error) {
        console.error('서치 TOP 20 컨트롤러 오류:', error);
        return res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

module.exports = {
    getSearchTop20
};

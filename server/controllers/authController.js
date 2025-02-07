const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');

exports.login = async (req, res) => {
    try {
        console.log('[Auth Controller] 로그인 요청:', { 
            body: req.body,
            headers: req.headers
        });

        const { sha2_hash } = req.body;

        if (!sha2_hash) {
            console.warn('[Auth Controller] 해시값 누락');
            return res.status(400).json({ 
                success: false,
                message: 'SHA2 해시값이 필요합니다.' 
            });
        }

        // 사용자 인증
        const user = await Auth.verifyUser(sha2_hash);

        if (!user) {
            console.warn('[Auth Controller] 유효하지 않은 해시:', { sha2_hash });
            return res.status(401).json({ 
                success: false,
                message: '유효하지 않은 인증키입니다.' 
            });
        }

        console.log('[Auth Controller] 사용자 인증 성공:', { sha2_hash });

        // JWT 토큰 생성
        const token = jwt.sign(
            { sha2_hash: user.sha2_hash },
            process.env.JWT_SECRET || 'lghellovisionvodteam3',
            { expiresIn: '14d' } // JWT 토큰의 만료 기간을 14일로 변경
        );

        console.log('[Auth Controller] JWT 토큰 생성 완료');

        res.json({
            success: true,
            message: '로그인 성공',
            token,
            sha2_hash: user.sha2_hash
        });

    } catch (error) {
        console.error('[Auth Controller] 로그인 에러:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ 
            success: false,
            message: '서버 에러가 발생했습니다.' 
        });
    }
};

// JWT 토큰 검증 미들웨어
exports.authenticateToken = (req, res, next) => {
    try {
        console.log('[Auth Controller] 토큰 검증:', {
            path: req.path,
            method: req.method
        });

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.warn('[Auth Controller] 토큰 누락');
            return res.status(401).json({ 
                success: false,
                message: '인증 토큰이 필요합니다.' 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'lghellovisionvodteam3', (err, decoded) => {
            if (err) {
                console.error('[Auth Controller] 토큰 검증 실패:', {
                    error: err.message,
                    tokenError: err.name
                });

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        success: false,
                        message: '토큰이 만료되었습니다.' 
                    });
                }
                return res.status(403).json({ 
                    success: false,
                    message: '유효하지 않은 토큰입니다.' 
                });
            }

            console.log('[Auth Controller] 토큰 검증 성공:', {
                user: decoded.sha2_hash
            });

            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('[Auth Controller] 토큰 검증 에러:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(500).json({ 
            success: false,
            message: '서버 에러가 발생했습니다.' 
        });
    }
};

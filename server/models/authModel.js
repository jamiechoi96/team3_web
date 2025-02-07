const mysql = require('mysql2/promise'); // mysql2 패키지 사용

// 로컬 데이터베이스 설정
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'admin1234',
  database: 'lg_hellovisionvod',
};

// 데이터베이스 풀 생성
const pool = mysql.createPool(dbConfig);

class Auth {
    static async verifyUser(sha2_hash) {
        try {
            console.log('[Auth Model] 사용자 인증 시도:', { sha2_hash });
            
            const [rows] = await pool.execute(
                'SELECT sha2_hash FROM users WHERE sha2_hash = ?',
                [sha2_hash]
            );
            
            console.log('[Auth Model] 쿼리 결과:', { 
                found: rows.length > 0,
                rowCount: rows.length
            });

            return rows[0];
        } catch (error) {
            console.error('[Auth Model] 데이터베이스 에러:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw error;
        }
    }
}

module.exports = Auth;
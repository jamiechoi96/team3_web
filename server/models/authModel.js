const { executeQuery } = require('../utils/database');

class Auth {
  static async verifyUser(sha2_hash) {
    try {
      console.log('[Auth Model] 사용자 인증 시도:', { sha2_hash });
      
      const rows = await executeQuery(
        'SELECT sha2_hash FROM users WHERE sha2_hash = ?',
        [sha2_hash]
      );
      
      console.log('[Auth Model] 쿼리 결과:', { 
        found: rows.length > 0,
        rowCount: rows.length
      });

      if (rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
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
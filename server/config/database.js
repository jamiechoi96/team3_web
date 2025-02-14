const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// ✅ DB 설정 생성
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// 설정 값 출력
console.log('✅ 데이터베이스 설정 로드 중...');
console.log('DB 설정:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

// 필수 환경 변수 확인
if (!dbConfig.host) {
  console.error('❌ DB_HOST가 설정되지 않음');
  process.exit(1);
}

module.exports = {
  dbConfig
};
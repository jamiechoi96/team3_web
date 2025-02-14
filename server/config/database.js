const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// ✅ DB 설정 생성
const dbHostBase = process.env.DB_HOST;
const dbSuffixes = process.env.DB_SUFFIXES 
  ? process.env.DB_SUFFIXES.split(',').map(suffix => suffix.trim())
  : [];

// 설정 값 출력
console.log('✅ 데이터베이스 설정 로드 중...');
console.log('DB_HOST:', dbHostBase);
console.log('DB_SUFFIXES:', dbSuffixes);

// 필수 환경 변수 확인
if (!dbHostBase || dbSuffixes.length === 0) {
  console.error('❌ DB_HOST 또는 DB_SUFFIXES가 설정되지 않음');
  process.exit(1);
}
const formattedDbHostBase = dbHostBase.endsWith('.') ? dbHostBase : `${dbHostBase}.`;

const dbConfigs = dbSuffixes.map((suffix) => {
  const config = {
    host: `${formattedDbHostBase}${suffix}`, // 수정된 호스트 주소
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  console.log(`✅ DB 설정 생성: ${config.host}`);
  return config;
});

// 로컬 DB 설정 (Fallback)
const localDbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'lg_hellovisionvod',
};

module.exports = {
  dbConfigs,
  localDbConfig
};
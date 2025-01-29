const path = require('path'); // 파일 경로 설정을 위한 모듈\
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // .env 파일에서 환경 변수 로드


// ✅ 105,115 DB 전용 설정 ===========================================


// // 환경 변수에서 기본 DB 호스트와 접미사 목록 가져오기
// const dbHostBase = process.env.DB_HOST;
// const dbSuffixes = process.env.DB_SUFFIXES 
//   ? process.env.DB_SUFFIXES.split(',').map(suffix => suffix.trim())
//   : [];

// // 설정 값 출력
// console.log('데이터베이스 설정 로드 중...');
// console.log('DB_HOST:', dbHostBase);
// console.log('DB_SUFFIXES:', dbSuffixes);

// // 필수 환경 변수 확인
// if (!dbHostBaseFromEnv || dbSuffixes.length === 0) {
//   console.error('데이터베이스 설정 오류: DB_HOST 또는 DB_SUFFIXES가 설정되지 않음');
//   process.exit(1); // 오류 시 종료
// }

// // 접미사별 DB 설정 생성
// const dbConfigs = dbSuffixes.map((suffix) => {
//   const config = {
//     host: `${dbHostBase}.${suffix}`, 
//     port: parseInt(process.env.DB_PORT) || 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   };
//   console.log(`데이터베이스 설정 생성: ${config.host}`);
//   return config;
// });

// module.exports = dbConfigs; // 설정 내보내기

// // =================================================================



// ✅ localhost 데이터베이스 설정 =======================================
// DB 설정 생성: localhost:3306 (DB: lg_hellovisionvod)
//  .env 파일에서 DB 관련 주석처리 후 사용 

const dbConfig = {
  host: 'localhost', // 로컬호스트
  port: 3306, // 포트 번호
  user: 'root', // 사용자 이름
  password: '1234', // 비밀번호
  database: 'lg_hellovisionvod', // 데이터베이스 이름
};



module.exports = [dbConfig]; // 설정 내보내기

// =================================================================
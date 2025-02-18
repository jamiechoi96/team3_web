const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./server/routes/api');
const { createConnection } = require('./server/utils/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 정적 파일 서빙 (빌드된 프론트엔드)
app.use(express.static(path.join(__dirname, 'client/dist')));

// API 라우트
app.use('/api', apiRoutes);

// SPA 지원을 위한 라우팅 (모든 요청을 index.html로)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// 서버 시작
async function startServer() {
  try {
    // DB 연결 테스트
    const connection = await createConnection();
    await connection.end();
    console.log('데이터베이스 연결 성공');

    const PORT = process.env.PORT || 5001;
    
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`서버 실행 중: http://localhost:${PORT}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();

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

// API 라우트
app.use('/api', apiRoutes);

// 리액트 라우팅
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// 서버 시작
async function startServer() {
  try {
    // DB 연결 테스트
    const connection = await createConnection();
    await connection.end();
    console.log('데이터베이스 연결 성공');

    const PORT = process.env.PORT || 5001;
    const VITE_PORT = process.env.VITE_PORT || 5173;
    
    // 기존 프로세스 종료
    const server = app.listen(PORT, () => {
      console.log('=================================');
      console.log(`백엔드 서버: http://localhost:${PORT}`);
      console.log(`프론트엔드 서버: http://localhost:${VITE_PORT}`);
      console.log('=================================');
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`포트 ${PORT}가 이미 사용 중입니다. 다른 포트를 시도합니다...`);
        server.close();
        app.listen(0, () => {
          const newPort = server.address().port;
          console.log('=================================');
          console.log(`백엔드 서버: http://localhost:${newPort}`);
          console.log(`프론트엔드 서버: http://localhost:${VITE_PORT}`);
          console.log('=================================');
        });
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

startServer();

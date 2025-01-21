const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 데이터베이스 설정
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// TMDB 설정 추가
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("데이터베이스 연결 성공");
    await connection.end();
    return true;
  } catch (error) {
    console.error("데이터베이스 연결 오류:", error.message);
    return false;
  }
}

// 서버 시작
async function startServer() {
  // 데이터베이스 연결 테스트
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log("데이터베이스 연결 실패. MySQL이 실행 중인지 확인해주세요.");
    console.log("서버를 다시 시작하려면 코드를 수정하거나 rs를 입력하세요.");
    return;
  }

  // API 라우트
  app.get("/api/watch-history", async (req, res) => {
    let connection;
    try {
      const { userHash } = req.query;
      console.log("\n=== 시청 기록 요청 시작 ===");
      console.log("요청된 userHash:", userHash);

      if (!userHash) {
        console.log("userHash 누락");
        return res.status(400).json({ error: "userHash가 필요합니다" });
      }

      connection = await mysql.createConnection(dbConfig);
      console.log("데이터베이스 연결됨");

      const [rows] = await connection.execute(
        
        // 192.168.0.105 DB 일때 

        // WITH RankedContent AS (
        //   SELECT 
        //     sha2_hash,
        //     SUBSTRING_INDEX(category, '/', -1) AS category,
        //     MAX(strt_dt) AS latest_strt_dt,
        //     SUM(use_tms) AS total_use_tms,
        //     SUBSTRING_INDEX(MAX(CONCAT(strt_dt, '_', asset_nm)), '_', -1) AS latest_episode
        //   FROM 
        //     vod_drama_06
        //   WHERE 
        //     sha2_hash = ?
        //   GROUP BY 
        //     sha2_hash, SUBSTRING_INDEX(category, '/', -1)
        // )
        // SELECT 
        //   sha2_hash,
        //   category,
        //   latest_strt_dt,
        //   total_use_tms,
        //   latest_episode
        // FROM 
        //   RankedContent
        // ORDER BY 
        //   latest_strt_dt DESC
        // LIMIT 5;
        `
        WITH RankedContent AS (
          SELECT 
            sha2_hash,
            category,
            latest_strt_dt,
            total_use_tms,
            latest_episode
          FROM 
            vod_drama_06
          WHERE 
            sha2_hash = ?
        )
        SELECT 
          sha2_hash,
          category,
          latest_strt_dt,
          total_use_tms,
          latest_episode
        FROM 
          RankedContent
        ORDER BY 
          latest_strt_dt DESC
        LIMIT 5;

      `,
        [userHash] // URL에서 받은 userHash 사용
      );

      console.log("쿼리 결과:", rows);
      res.json(rows);
      console.log("=== 시청 기록 요청 완료 ===\n");
    } catch (error) {
      console.error("데이터베이스 오류:", error);
      res.status(500).json({
        오류: "데이터베이스 쿼리 오류",
        상세: error.message,
      });
    } finally {
      if (connection) {
        try {
          await connection.end();
          console.log("데이터베이스 연결 종료");
        } catch (err) {
          console.error("연결 종료 중 오류 발생:", err);
        }
      }
    }
  });

  app.get("/api/test", (req, res) => {
    res.json({ message: "백엔드 서버가 실행 중입니다!" });
  });

  // 리액트 라우팅 처리, 모든 요청을 리액트 앱으로 리다이렉트
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
    console.log(`서버 주소: http://localhost:${PORT}`);
  });
}

// 서버 시작
startServer();

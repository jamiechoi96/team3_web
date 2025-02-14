const mysql = require('mysql2/promise');
const { dbConfig } = require('../config/database');

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2초

// DB 연결 시도 함수
async function tryConnect(config, retries = 0) {
  try {
    const connection = await mysql.createConnection(config);
    console.log(`✅ DB 연결 성공: ${config.host}`);
    return connection;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`⚠️ 연결 실패, ${RETRY_DELAY/1000}초 후 재시도... (${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return tryConnect(config, retries + 1);
    }
    throw error;
  }
}

// DB 연결 생성
async function createConnection() {
  return await tryConnect(dbConfig);
}

// 쿼리 실행 함수
async function executeQuery(query, params = []) {
  const connection = await createConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = {
  createConnection,
  executeQuery
};
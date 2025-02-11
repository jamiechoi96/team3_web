const mysql = require('mysql2/promise');
const { dbConfigs, localDbConfig } = require('../config/database');

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

// 모든 DB 연결 생성
async function createConnections() {
  try {
    // 먼저 105, 115 DB 연결 시도
    const connections = await Promise.all(
      dbConfigs.map(config => tryConnect(config))
    );
    
    // 연결된 DB가 없으면 로컬 DB로 시도
    if (connections.every(conn => !conn)) {
      console.log('⚠️ 105, 115 DB 연결 실패, 로컬 DB 시도 중...');
      const localConnection = await tryConnect(localDbConfig);
      return [localConnection];
    }
    
    return connections;
  } catch (error) {
    console.error('❌ DB 연결 오류:', error.message);
    throw error;
  }
}

// 쿼리 실행 함수
async function executeQuery(query, params = []) {
  let connection;
  try {
    const connections = await createConnections();
    connection = connections[0]; // 첫 번째 연결된 DB 사용
    
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  createConnections,
  executeQuery
};
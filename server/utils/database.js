const mysql = require('mysql2/promise');
const dbConfigs = require('../config/database');

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2초

async function tryConnect(config, retries = 0) {
  try {
    const connection = await mysql.createConnection(config);
    console.log(`데이터베이스 연결 성공: ${config.host}`);
    return connection;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`연결 실패, ${RETRY_DELAY/1000}초 후 재시도... (${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return tryConnect(config, retries + 1);
    }
    throw error;
  }
}

async function createConnections() {
  try {
    const connections = await Promise.all(
      dbConfigs.map(config => tryConnect(config))
    );
    return connections;
  } catch (error) {
    console.error('데이터베이스 연결 오류:', error.message);
    throw error;
  }
}

module.exports = {
  createConnections
};

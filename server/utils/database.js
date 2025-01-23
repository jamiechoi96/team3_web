const mysql = require('mysql2/promise');
const dbConfigs = require('../config/database');

async function createConnections() {
  try {
    const connections = await Promise.all(
      dbConfigs.map(config => mysql.createConnection(config))
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

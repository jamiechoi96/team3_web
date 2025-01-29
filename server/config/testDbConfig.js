const dbConfigs = require('./database');

console.log('데이터베이스 설정 테스트:');
dbConfigs.forEach((config, index) => {
    console.log(`\n데이터베이스 ${index + 1} 설정:`);
    console.log('호스트:', config.host);
    console.log('포트:', config.port);
    console.log('사용자:', config.user);
    console.log('데이터베이스:', config.database);
});

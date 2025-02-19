# VODiscovery AWS EC2 호스팅 가이드

## 1. EC2 인스턴스 설정

### 1.1 인스턴스 생성
- AWS EC2 콘솔에서 인스턴스 시작
- Ubuntu Server 선택
- t2.micro (프리티어) 선택
- 보안 그룹 설정:
  - SSH (22번 포트)
  - HTTP (80번 포트)
  - 사용자 지정 TCP (5001번 포트)

### 1.2 탄력적 IP 할당
1. EC2 대시보드 -> "네트워크 및 보안" -> "탄력적 IP"
2. "탄력적 IP 주소 할당" 클릭
3. 할당받은 IP를 인스턴스와 연결
   - 작업 -> "탄력적 IP 주소 연결"
   - 인스턴스 선택 후 연결

## 2. 서버 환경 설정

### 2.1 EC2 접속
```bash
ssh -i [키페어경로] ubuntu@[탄력적IP]
```

### 2.2 Node.js 설치
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.3 PM2 설치
```bash
sudo npm install -g pm2
```

## 3. 프로젝트 배포

### 3.1 프로젝트 클론
```bash
cd ~
git clone https://github.com/jamiechoi96/team3_web.git
cd team3_web
```

### 3.2 환경변수 설정

#### 서버 .env 파일 (/team3_web/.env)
```bash
echo "PORT=5001
TMDB_API_KEY=0058a62923db25cb8d799d267036fb75

DB_HOST=vod.cpwwqkgmec4j.us-east-2.rds.amazonaws.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=lghellovision5432!!
DB_NAME=lg_hellovisionvod" > .env
```

#### 클라이언트 .env 파일 (/team3_web/client/.env)
```bash
cd client
echo "# 오픈웨더 키
REACT_APP_OpenWeather_Key=fcb47ba0d96d38a536f0802c0e9a74e1
VITE_OpenWeather_Key=fcb47ba0d96d38a536f0802c0e9a74e1

# TMDB API
REACT_APP_TMDB_API=0058a62923db25cb8d799d267036fb75
VITE_TMDB_API=0058a62923db25cb8d799d267036fb75

# 서버 포트
PORT=5001" > .env
```

### 3.3 의존성 설치 및 빌드

#### 서버 의존성 설치
```bash
cd ~/team3_web
npm install
```

#### 클라이언트 빌드
```bash
cd client
npm install
npm run build
```

### 3.4 서버 실행
```bash
cd ~/team3_web
pm2 start server.js
```

### 3.5 서버 상태 확인
```bash
pm2 status    # 서버 상태 확인
pm2 logs      # 로그 확인
```

## 4. 서버 관리 명령어

### 4.1 PM2 명령어
```bash
pm2 restart server    # 서버 재시작
pm2 stop server      # 서버 중지
pm2 delete server    # 서버 삭제
```

### 4.2 로그 확인
```bash
pm2 logs            # 실시간 로그
pm2 logs --lines 1000  # 최근 1000줄 로그
```

## 5. 접속 정보
- 웹사이트 접속: `http://[탄력적IP]:5001`
- API 엔드포인트: `http://[탄력적IP]:5001/api`

## 6. 주의사항
1. EC2 인스턴스 재시작 시에도 PM2가 자동으로 서버를 재시작
2. 코드 수정 시:
   ```bash
   cd ~/team3_web
   git pull
   cd client && npm run build
   cd .. && pm2 restart server
   ```
3. 환경변수 파일(.env)은 깃허브에 포함되어 있으므로 별도 관리 필요 없음

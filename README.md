

<div align="center">


  <img src="client/public/images/VODiscovery_w.png" alt="VODiscovery Logo" width="800"/>

  <p><em>스마트한 VOD 추천으로 당신의 시청 경험을 혁신합니다</em></p>
</div>

# VODiscovery: 맞춤형 VOD 추천 플랫폼 🎬

## 📑 목차
- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [상세 기능 명세](#-상세-기능-명세)
- [API 문서](#-api-문서)
- [개발 가이드](#-개발-가이드)
- [AWS EC2 배포 가이드](#-aws-ec2-배포-가이드)

## 📖 소개
VODiscovery는 사용자의 시청 패턴을 분석하여 개인화된 VOD 콘텐츠를 추천하는 스마트 플랫폼입니다. TMDB API와 연동하여 풍부한 콘텐츠 정보를 제공하며, 실시간 인기 순위와 맞춤형 추천으로 최적의 시청 경험을 제공합니다.

## 🌟 주요 기능

### 1. 실시간 TOP 20
- 인기 VOD 실시간 순위 제공
- TMDB 연동으로 풍부한 콘텐츠 정보 제공
- 직관적인 슬라이더 UI

### 2. 맞춤형 추천
- 사용자 시청 패턴 기반 추천
- 장르 선호도 분석
- 줄거리 기반 유사 콘텐츠 추천

### 3. 개인화 대시보드
- 시청 이력 관리
- 장르별 시청 통계
- 선호 시간대 분석

## 🛠 기술 스택

### 프론트엔드
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=Axios&logoColor=white)

### 백엔드
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)
- ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white)
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white)

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상
- MySQL 8.0 이상

### 설치 및 실행

1. 저장소 클론
```bash
git clone [repository-url]
cd team3_web
```

2. 환경 변수 설정
```bash
<!-- # .env 파일 생성
PORT=5001
TMDB_API_KEY=your_api_key
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name -->
```

3. 의존성 설치 및 실행
```bash
# 전체 의존성 설치
npm run install-all

# 개발 모드 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 📁 프로젝트 구조

```plaintext
team3_web/
├── client/                 # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   │   ├── Main/     # 메인 페이지 관련
│   │   │   ├── Header/   # 헤더 컴포넌트
│   │   │   └── Mypage/   # 마이페이지 컴포넌트
│   │   ├── App.jsx       # 앱 메인 컴포넌트
│   │   └── main.jsx      # 진입점
├── server/                # 백엔드 (Express)
│   ├── routes/           # API 라우트
│   ├── controllers/      # 비즈니스 로직
│   ├── models/          # 데이터베이스 모델
│   └── utils/           # 유틸리티 함수
└── package.json         # 프로젝트 설정
```

## 📋 상세 기능 명세

### 1. 메인 페이지
#### 1.1 헤더
- VODiscovery 로고 및 메인 페이지 링크
- 영화, 예능, 드라마, 키즈/애니 카테고리 네비게이션
- 날씨 위젯 통합
- 검색 및 마이페이지 접근

#### 1.2 실시간 TOP 20
- 실시간 인기 VOD 순위 (1-20위)
- 순위별 차별화된 디자인 (1-3위 특별 스타일)
- TMDB 연동 포스터 및 상세 정보
- 반응형 슬라이더 구현

#### 1.3 맞춤형 추천
- 신규 콘텐츠 섹션
- 유사 사용자 기반 추천
- 줄거리 기반 추천
- 선호 장르 기반 추천

### 2. 마이페이지
#### 2.1 사용자 정보
- 프로필 정보 표시
- 구독 상태 관리
- 셋톱박스 정보

#### 2.2 시청 분석
- 장르별 시청 비율 차트
- 선호 시청 시간대 분석
- 상세 시청 이력

### 3. 데이터베이스 구조
#### 3.1 주요 테이블
- users: 사용자 기본 정보
- user_based_top20: 추천 VOD
- vod_movie_rank_04_01: VOD 순위
- user_viewing_patterns: 시청 패턴

#### 3.2 데이터 보안
- JWT 기반 인증 (14일 유효)
- SHA2 해시 암호화
- 환경 변수 관리

## 📚 API 문서

### 인증 API
- `POST /api/auth/login`: 사용자 로그인
- `GET /api/auth/verify`: 토큰 검증

### 콘텐츠 API
- `GET /api/contents/top20`: 실시간 TOP 20 조회
- `GET /api/contents/recommend`: 맞춤 추천 콘텐츠
- `GET /api/contents/similar`: 유사 콘텐츠 추천

### 사용자 API
- `GET /api/user/history`: 시청 이력 조회
- `GET /api/user/stats`: 시청 통계 조회

## 💻 개발 가이드

### 코드 컨벤션
- ESLint와 Prettier 설정 준수
- 컴포넌트는 기능별로 분리
- 재사용 가능한 컴포넌트는 common 폴더에 위치

### Git 워크플로우
1. feature/ 브랜치에서 개발
2. develop 브랜치로 PR 생성
3. 코드 리뷰 후 머지

### 명명 규칙
- 컴포넌트: PascalCase
- 함수/변수: camelCase
- 상수: UPPER_SNAKE_CASE

## 🚀 AWS EC2 배포 가이드

### 1. EC2 인스턴스 설정
1. AWS 콘솔에서 EC2 인스턴스 생성
   ```bash
   # 인스턴스 타입 추천
   t2.micro (프리티어) 또는 t2.small
   
   # 운영체제
   Ubuntu Server 22.04 LTS
   ```

2. 보안 그룹 설정
   ```bash
   # 인바운드 규칙
   - SSH (22): 내 IP
   - HTTP (80): 모든 곳
   - HTTPS (443): 모든 곳
   - Custom TCP (5001): 모든 곳 # 백엔드 서버 포트
   - Custom TCP (5173): 모든 곳 # Vite 개발 서버 포트
   ```

### 2. 서버 초기 설정
```bash
# 서버 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 시스템 업데이트
sudo apt update
sudo apt upgrade -y

# Node.js 설치 (18.x 버전)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL 설치
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# Git 설치
sudo apt install git -y

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2
```

### 3. 프로젝트 배포
```bash
# 프로젝트 클론
git clone https://github.com/jamiechoi96/team3_web.git
cd team3_web

# 환경 변수 설정
cp .env.example .env
nano .env  # 환경 변수 수정

# 의존성 설치
npm run install-all

# 프론트엔드 빌드
cd client
npm run build
cd ..

# PM2로 서버 실행
pm2 start server.js --name "vod-server"
```

### 4. Nginx 설정
```bash
# Nginx 설치
sudo apt install nginx -y

# Nginx 설정
sudo nano /etc/nginx/sites-available/vod-discovery

# 아래 내용 추가
server {
    listen 80;
    server_name your-domain.com;  # 도메인이 있는 경우 설정

    # 프론트엔드 (빌드된 파일 제공)
    location / {
        root /home/ubuntu/team3_web/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 설정 활성화
sudo ln -s /etc/nginx/sites-available/vod-discovery /etc/nginx/sites-enabled/
sudo nginx -t  # 설정 테스트
sudo systemctl restart nginx
```

### 5. SSL 설정 (선택사항)
```bash
# Certbot 설치
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com
```

### 6. 모니터링 및 로그 확인
```bash
# PM2 상태 확인
pm2 status
pm2 logs vod-server

# Nginx 로그 확인
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 7. 자동 배포 스크립트 (deploy.sh)
```bash
#!/bin/bash
# 프로젝트 루트 디렉토리에 deploy.sh 생성

git pull
npm run install-all
cd client
npm run build
cd ..
pm2 restart vod-server
```

### 8. 문제 해결
- 포트 충돌: `sudo netstat -tulpn | grep LISTEN`
- 프로세스 종료: `pm2 delete vod-server`
- Nginx 재시작: `sudo systemctl restart nginx`
- 로그 확인: `pm2 logs vod-server --lines 100`

---

## 👥 팀원
- 팀원 1: 프론트엔드 개발
- 팀원 2: 백엔드 개발 및 웹 디자인
- 팀원 3: DB 구축 및 데이터 분석

## 📝 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.

# VODiscovery: 맞춤형 VOD 추천 플랫폼 🎬

<div align="center">
<<<<<<< HEAD
  <img src="client/public/images/VODiscovery_w.png" alt="VODiscovery Logo" width="400"/>
=======
  <img src="client/public/images/VODiscovery_w" alt="VODiscovery Logo" width="200"/>
>>>>>>> fee268fdb008d8ff1622cbfe1f5197a161ce61cf
  <p><em>스마트한 VOD 추천으로 당신의 시청 경험을 혁신합니다</em></p>
</div>

## 📑 목차
- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [상세 기능 명세](#-상세-기능-명세)
- [API 문서](#-api-문서)
- [개발 가이드](#-개발-가이드)

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
# .env 파일 생성
PORT=5001
TMDB_API_KEY=your_api_key
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
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

---

## 👥 팀원
- 개발자 1: 프론트엔드 개발
- 개발자 2: 백엔드 개발
- 개발자 3: UI/UX 디자인

## 📝 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.

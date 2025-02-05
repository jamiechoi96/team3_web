# HelloTV 프로젝트 가이드 문서

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [프로젝트 구조](#프로젝트-구조)
3. [개발 환경 설정](#개발-환경-설정)
4. [실행 방법](#실행-방법)
5. [주요 기능 설명](#주요-기능-설명)
6. [기술 스택](#기술-스택)
7. [API 문서](#api-문서)
8. [개발 가이드라인](#개발-가이드라인)
9. [배포 가이드](#배포-가이드)
10. [문제 해결](#문제-해결)

## 프로젝트 개요
HelloTV는 사용자에게 맞춤형 콘텐츠를 추천하고 시청할 수 있는 웹 서비스입니다. 
React를 기반으로 한 프론트엔드와 Node.js 기반의 백엔드로 구성되어 있습니다.

## 프로젝트 구조
```
webTest/
├── client/                 # 프론트엔드 코드
│   ├── public/            # 정적 파일
│   └── src/
│       ├── assets/        # 이미지, 폰트 등 리소스
│       ├── components/    # React 컴포넌트
│       │   ├── Main/     # 메인 페이지 관련 컴포넌트
│       │   │   ├── Recommend/  # 추천 콘텐츠 컴포넌트
│       │   │   └── Watching/   # 시청 중인 콘텐츠 컴포넌트
│       ├── App.jsx        # 앱 메인 컴포넌트
│       ├── main.jsx       # 앱 진입점
│       └── axios.js       # API 통신 설정
├── server/                # 백엔드 코드
│   ├── routes/           # API 라우트 정의
│   ├── controllers/      # 비즈니스 로직
│   ├── models/          # 데이터베이스 모델
│   └── config/          # 설정 파일
├── .env                  # 환경 변수 설정
├── server.js             # 서버 진입점
└── package.json          # 프로젝트 의존성 관리

## 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상
- MySQL 8.0 이상

### 초기 설정
1. 프로젝트 클론
```bash
git clone [repository-url]
cd webTest
```

2. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정합니다:
```env
PORT=5001
TMDB_API_KEY=0058a62923db25cb8d799d267036fb75

DB_HOST=192.168.0
DB_SUFFIXES=105,115
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=lg_hellovisionvod
```

3. 의존성 설치
```bash
# 전체 의존성 설치 (서버 + 클라이언트)
npm run install-all
```

## 실행 방법

### 개발 모드
1. 전체 애플리케이션 실행 (백엔드 + 프론트엔드):
```bash
npm run dev
```

2. 백엔드 서버만 실행:
```bash
npm run server
```

3. 프론트엔드 개발 서버만 실행:
```bash
npm run client
```

### 프로덕션 모드
1. 프론트엔드 빌드:
```bash
npm run build
```

2. 서버 실행:
```bash
npm start
```

## 주요 기능 설명

### 1. 메인 페이지 (/)
- 사용자 맞춤형 콘텐츠 추천
- 실시간 인기 콘텐츠 표시
- 최근 시청 목록 표시

### 2. 시청 페이지 (/watch)
- 콘텐츠 재생 기능
- 관련 콘텐츠 추천
- 시청 기록 저장

### 3. 추천 시스템
- 사용자 시청 기록 기반 추천
- 인기도 기반 추천
- 카테고리별 추천

## 기술 스택

### 프론트엔드
- React 18
- Vite (빌드 도구)
- Axios (HTTP 클라이언트)
- 상태 관리: (사용 중인 상태 관리 라이브러리)
- UI 라이브러리: (사용 중인 UI 라이브러리)

### 백엔드
- Node.js
- Express.js
- MySQL (데이터베이스)
- JWT (인증)

## API 문서

### 인증 관련 API
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/verify

### 콘텐츠 관련 API
- GET /api/contents
- GET /api/contents/:id
- GET /api/contents/recommend
- POST /api/contents/watch

## 개발 가이드라인

### 1. 코드 스타일
- ESLint와 Prettier 설정을 따릅니다
- 컴포넌트는 기능별로 분리하여 작성합니다
- 재사용 가능한 컴포넌트는 components/common에 위치시킵니다

### 2. Git 워크플로우
- feature/ 브랜치에서 개발
- develop 브랜치로 PR 생성
- 코드 리뷰 후 머지

### 3. 명명 규칙
- 컴포넌트: PascalCase
- 함수 및 변수: camelCase
- 상수: UPPER_SNAKE_CASE

## 배포 가이드

### 1. 배포 전 체크리스트
- 환경 변수 설정 확인
- 빌드 테스트
- 테스트 케이스 실행

### 2. 배포 프로세스
1. 프론트엔드 빌드
2. 백엔드 배포
3. 데이터베이스 마이그레이션

## 문제 해결

### 일반적인 문제
1. 서버 연결 오류
   - .env 파일 설정 확인
   - 포트 충돌 확인
   - 데이터베이스 연결 상태 확인

2. 빌드 오류
   - node_modules 삭제 후 재설치
   - 캐시 삭제: `npm cache clean --force`
   - 의존성 버전 충돌 확인

3. API 오류
   - 네트워크 상태 확인
   - API 엔드포인트 URL 확인
   - 토큰 만료 여부 확인

### 로그 확인
- 서버 로그: `npm run server` 실행 시 콘솔
- 클라이언트 로그: 브라우저 개발자 도구 콘솔

## 참고 사항
- 이슈 발생 시 GitHub Issues에 등록해주세요
- 코드 변경 시 관련 문서도 함께 업데이트해주세요
- API 변경 시 팀원들과 사전 논의가 필요합니다

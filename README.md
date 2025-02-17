# team3_hellotv
# Hellotv Web Development

# Project Structure
```plaintext
webTest/
├── client/                        # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── components/           
│   │   │   ├── Header/          # 헤더 영역
│   │   │   │   ├── Header.jsx   # 네비게이션, 로고 등
│   │   │   │   └── Header.css
│   │   │   │
│   │   │   ├── Main/            
│   │   │   │   ├── Home/        # 메인 홈페이지
│   │   │   │   │   ├── Home.jsx
│   │   │   │   │   └── Home.css
│   │   │   │   │
│   │   │   │   ├── Recommend/   # 컨텐츠 추천 섹션
│   │   │   │   │   ├── Watching/
│   │   │   │   │   │   ├── TOP20.jsx        # TOP20 컨텐츠 표시
│   │   │   │   │   │   └── ImageCard.jsx    # 컨텐츠 카드 컴포넌트
│   │   │   │   │   └── RecommendContents.jsx
│   │   │   │   │
│   │   │   │   ├── Banner/      # 배너 섹션
│   │   │   │   │   ├── Banner.jsx
│   │   │   │   │   └── Banner.css
│   │   │   │   │
│   │   │   │   └── Search/      # 검색 기능
│   │   │   │       ├── Search.jsx
│   │   │   │       └── Search.css
│   │   │   │
│   │   │   ├── Mypage/          # 사용자 개인화 페이지
│   │   │   │   ├── MyPage.jsx   # 시청 기록 등 표시
│   │   │   │   └── MyPage.css
│   │   │   │
│   │   │   └── Footer/          # 푸터 영역
│   │   │       ├── Footer.jsx
│   │   │       └── Footer.css
│   │   │
│   │   ├── App.jsx              # 라우팅 및 전체 레이아웃
│   │   ├── App.css              
│   │   ├── main.jsx             # React 진입점
│   │   └── index.css            # 글로벌 스타일
│   │
│   └── public/                   # 정적 리소스
│       ├── index.html
│       └── vite.svg
│
├── server/                        # 백엔드 (Express)
│   ├── config/
│   │   └── database.js          # MySQL 연결 설정
│   │
│   ├── controllers/
│   │   └── watchHistoryController.js  # 시청 기록 처리 로직
│   │
│   ├── models/
│   │   └── watchHistory.js      # 시청 기록 데이터 모델
│   │
│   ├── routes/
│   │   └── api.js               # API 라우트 (/api/watch-history 등)
│   │
│   └── utils/
│       └── database.js          # DB 연결 관리
│
├── server.js                      # Express 서버 설정
└── package.json                   # 프로젝트 의존성 및 스크립트

```

```mermaid
flowchart LR
    %% 클라이언트 (React 앱)
    subgraph Client[클라이언트 React App]
        A[브라우저/로그인 페이지]
        C[Main 페이지]
        D[Banner 컴포넌트]
        E[Header 컴포넌트]
        A -- "로그인 성공 (JWT 저장)" --> C
        C --> D
        C --> E
    end

    %% API 서버 (Express)
    subgraph Server[API 서버 Express]
        F[Express 서버]
        M[JWT 미들웨어]
        N[Auth Controller]
        O[Watch History Controller]
        P[Top20 Controller]
        Q[Recommendation Controller]
    end

    %% 데이터베이스
    subgraph DB[데이터베이스]
        R[사용자/인증 데이터 DB]
        S[콘텐츠/시청 기록 데이터 DB]
    end

    %% 동작하는 흐름 (실제 통신)
    %% 로그인 요청
    A -- "POST: /auth/login (셋탑박스번호)" --> F
    F -- "로그인 처리" --> N
    N -- "사용자 인증 후 JWT 발급" --> A
    N -- "사용자 정보 조회" --> R

    %% 메인 페이지 접근 (인증 필요)
    C -- "GET: /main (JWT 포함)" --> F
    F -- "JWT 검증" --> M
    M -- "유효성 확인 후 허용" --> C

    %% TOP 20 요청 (인증 불필요)
    C -- "GET: /top20" --> F
    F -- "콘텐츠 조회" --> P
    P -- "DB 조회" --> S

    %% 보호된 요청들 (인증 필요)
    C -- "GET: /watch-history (JWT 포함)" --> F
    F -- "JWT 검증" --> M
    M -- "시청 기록 컨트롤러 호출" --> O
    O -- "시청 기록 조회" --> S

    C -- "POST: /recommendation (JWT 포함)" --> F
    F -- "JWT 검증" --> M
    M -- "추천 컨트롤러 호출" --> Q
    Q -- "추천 연산 수행" --> S

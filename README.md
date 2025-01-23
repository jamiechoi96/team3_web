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
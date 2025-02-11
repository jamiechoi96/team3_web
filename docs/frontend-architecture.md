flowchart LR
    %% 외부 API
    subgraph ExternalAPI[외부 API]
        TMDB[TMDB API]
    end

    %% 프론트엔드 컴포넌트 구조
    subgraph Frontend[프론트엔드 React]
        direction TB
        APP[App.jsx]
        Router[React Router]
        
        subgraph Pages[페이지 컴포넌트]
            Login[로그인 페이지]
            Main[메인 페이지]
            MyPage[마이 페이지]
            Search[검색 페이지]
        end

        subgraph Components[주요 컴포넌트]
            Header[헤더]
            Weather[날씨 위젯]
            Banner[배너]
            
            subgraph Recommend[추천 시스템]
                RecommendContents[추천 컨텐츠]
                TOP20[TOP 20]
                ImageCard[이미지 카드]
                Popup[상세 팝업]
            end
        end

        subgraph Utils[유틸리티]
            Axios[Axios 인터셉터]
            LocalStorage[로컬 스토리지]
            AuthContext[인증 Context]
        end
    end

    %% 백엔드 시스템
    subgraph Backend[백엔드 Express]
        Express[Express 서버]
        
        subgraph Middleware[미들웨어]
            JWT[JWT 검증]
            ErrorHandler[에러 핸들러]
            Logger[로깅]
        end

        subgraph Controllers[컨트롤러]
            AuthController[인증 컨트롤러]
            WatchController[시청기록 컨트롤러]
            Top20Controller[TOP20 컨트롤러]
            RecommendController[추천 컨트롤러]
        end

        subgraph Services[서비스 레이어]
            AuthService[인증 서비스]
            WatchService[시청기록 서비스]
            RecommendService[추천 서비스]
            TMDBService[TMDB 서비스]
        end

        subgraph Models[모델]
            UserModel[사용자 모델]
            WatchModel[시청기록 모델]
            Top20Model[TOP20 모델]
        end
    end

    %% 데이터베이스
    subgraph DB[MongoDB]
        Users[(사용자 컬렉션)]
        WatchHistory[(시청기록 컬렉션)]
        Top20[(TOP20 컬렉션)]
    end

    %% 토큰 흐름
    Login -- "1. ID/PW 전송" --> AuthController
    AuthController -- "2. 사용자 검증" --> AuthService
    AuthService -- "3. DB 조회" --> Users
    AuthService -- "4. JWT 생성" --> AuthController
    AuthController -- "5. JWT 응답" --> Login
    Login -- "6. JWT 저장" --> LocalStorage
    LocalStorage -- "7. JWT 제공" --> AuthContext
    AuthContext -- "8. JWT 주입" --> Axios

    %% API 요청 흐름
    Axios -- "인증된 요청" --> Express
    Express --> JWT
    JWT --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> DB

    %% TMDB API 연동
    ImageCard -- "포스터 요청" --> TMDBService
    TMDBService -- "API 호출" --> TMDB
    TMDB -- "이미지 URL" --> ImageCard

    %% 추천 시스템 흐름
    RecommendContents -- "추천 요청" --> RecommendController
    RecommendController -- "추천 처리" --> RecommendService
    RecommendService -- "시청기록 조회" --> WatchHistory
    RecommendService -- "영화 정보" --> TMDB

    %% TOP20 처리
    TOP20 -- "순위 요청" --> Top20Controller
    Top20Controller -- "순위 조회" --> Top20Model
    Top20Model -- "데이터 조회" --> Top20

    %% 스타일링
    classDef frontend fill:#f9f,stroke:#333,stroke-width:2px
    classDef backend fill:#bbf,stroke:#333,stroke-width:2px
    classDef db fill:#dfd,stroke:#333,stroke-width:2px
    classDef api fill:#fdd,stroke:#333,stroke-width:2px
    
    class Frontend frontend
    class Backend backend
    class DB db
    class ExternalAPI api
```

# 시스템 아키텍처 상세 설명

## 토큰 인증 흐름
1. **로그인 프로세스**
   - 사용자가 ID/PW 입력 → 백엔드로 전송
   - 백엔드에서 사용자 검증 후 JWT 생성
   - JWT를 프론트엔드로 전송
   - 프론트엔드에서 LocalStorage에 JWT 저장
   - AuthContext를 통해 전역적으로 JWT 관리
   - Axios 인터셉터에서 모든 요청에 JWT 자동 주입

2. **API 요청 인증**
   - 모든 API 요청은 Axios 인터셉터를 통과
   - JWT가 헤더에 자동으로 포함
   - 백엔드 JWT 미들웨어에서 토큰 검증
   - 인증 실패 시 401 에러 반환

## TMDB API 연동
1. **포스터 이미지 처리**
   - ImageCard 컴포넌트에서 TMDB ID로 포스터 요청
   - 백엔드 TMDBService에서 TMDB API 호출
   - 이미지 URL 응답을 프론트엔드로 전달
   - ImageCard에서 이미지 렌더링

## 백엔드 시스템
1. **컨트롤러 레이어**
   - AuthController: 인증/인가 처리
   - WatchController: 시청 기록 관리
   - Top20Controller: 인기 콘텐츠 관리
   - RecommendController: 추천 시스템 관리

2. **서비스 레이어**
   - AuthService: JWT 생성/검증, 사용자 인증
   - WatchService: 시청 기록 처리 로직
   - RecommendService: 추천 알고리즘 구현
   - TMDBService: TMDB API 연동

3. **모델 레이어**
   - UserModel: 사용자 정보 스키마
   - WatchModel: 시청 기록 스키마
   - Top20Model: 인기 콘텐츠 스키마

4. **미들웨어**
   - JWT: 토큰 기반 인증
   - ErrorHandler: 전역 에러 처리
   - Logger: 요청/응답 로깅

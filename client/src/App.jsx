import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom"; // React Router 추가
import Header from "./components/Header/Header.jsx";
import Home from "./components/Main/Home/Home.jsx";
import Search from "./components/Search/Search.jsx"; // Search 컴포넌트 임포트
import Footer from "./components/Footer/Footer.jsx";
import Login from "./components/Login/Login.jsx";
import MyPage from "./components/MyPage/MyPage.jsx"; // MyPage 컴포넌트 임포트
import "./App.css";

// 동적으로 클래스 추가를 위한 컴포넌트
function Layout() {
  const location = useLocation(); // 현재 경로 확인
  const isHome = location.pathname === "/"; // Home 페이지 여부 확인

  // 로그인 상태 확인
  const isLoggedIn = localStorage.getItem('token') !== null;

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <div className={`main ${isHome ? "home-page" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Home />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
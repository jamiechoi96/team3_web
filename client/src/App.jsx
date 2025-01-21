import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom"; // React Router 추가
import Header from "./components/Header/Header.jsx";
import Home from "./components/Main/Home/Home.jsx";
import MyPage from "./components/Mypage/MyPage.jsx"; // MyPage 컴포넌트 임포트
import Search from "./components/Search/Search.jsx"; // Search 컴포넌트 임포트
import Footer from "./components/Footer/Footer.jsx";
import "./App.css";

// 동적으로 클래스 추가를 위한 컴포넌트
function Layout() {
  const location = useLocation(); // 현재 경로 확인
  const isHome = location.pathname === "/"; // Home 페이지 여부 확인

  return (
    <>
      <Header />
      <div className={`main ${isHome ? "home-page" : ""}`}>
        {" "}
        {/* Home 페이지일 때만 추가 클래스 적용 */}
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
      <Layout />
    </Router>
  );
}

export default App;

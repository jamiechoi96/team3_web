import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { IoCopyOutline } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";
import SearchImage from "./SearchImage.jsx";
import Dashboard from "./Dashboard";
import "./MyPage.css";

function MyPage() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreError, setGenreError] = useState(null);
  const [userHash, setUserHash] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const hash = token.split(".")[1];
    const decoded = JSON.parse(atob(hash));
    setUserHash(decoded.sha2_hash);

    const fetchWatchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/watch-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setWatchHistory(data);
        setError(null);
      } catch (error) {
        setError("오류가 발생했습니다: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenreStats = async () => {
      setGenreLoading(true);
      try {
        const response = await fetch(`/api/genre-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setGenreData(data);
        setGenreError(null);
      } catch (error) {
        setGenreError("장르 통계를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setGenreLoading(false);
      }
    };

    fetchWatchHistory();
    fetchGenreStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCopyHash = () => {
    if (userHash) {
      const textArea = document.createElement('textarea');
      textArea.value = userHash;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('복사 실패:', err);
      }
      
      document.body.removeChild(textArea);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: false,
    arrows: true,
    variableWidth: true,
    centerMode: false,
  };

  return (
    <div className="mypage">
      <div className="mypage_header">
        <div className="profile_section">
          <div className="profile_icon">프로필</div>
          <div className="set-top-box-container">
            <div className="set-top-box-number">
              {userHash && (
                <>
                  <span>셋탑박스 번호: {userHash}</span>
                  <button className="copy-button" onClick={handleCopyHash}>
                    {copySuccess ? <IoCheckmarkDone size={20} /> : <IoCopyOutline size={20} />}
                  </button>
                </>
              )}
              {copySuccess && <div className="copy-tooltip">복사되었습니다</div>}
            </div>
          </div>
        </div>
        <div className="logout-button" onClick={handleLogout}>로그아웃</div>
      </div>

      <div className="section">
        <h2 className="section_title">⌚최근 시청기록</h2>
        <div className="section_content watch-history">
          {loading ? (
            <div className="dashboard_loading">
              <div className="loading-spinner" /> 시청 기록을 불러오는 중...
            </div>
          ) : error ? (
            <div className="status-message error">{error}</div>
          ) : watchHistory.length > 0 ? (
            <Slider {...settings} className="slider">
              {watchHistory.map((item) => (
                <div
                  key={item.sha2_hash}
                  className="watch-history-item"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <SearchImage dbTitle={item.latest_episode} />
                  {hoveredItem === item && (
                    <div className="hover-info">
                      <p className="latest-episode-title">{item.latest_episode}</p>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          ) : (
            <div className="status-message">시청 기록이 없습니다.</div>
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">📊시청 패턴 분석</h2>
        <div className="section_content">
          {genreLoading ? (
            <div className="dashboard_loading">
              <div className="loading-spinner" /> 고객님의 시청 패턴을 분석중입니다📊
            </div>
          ) : genreError ? (
            <div className="status-message error">{genreError}</div>
          ) : (
            <Dashboard data={genreData} loading={genreLoading} />
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">찜한 콘텐츠</h2>
        <div className="section_content">찜한 콘텐츠가 여기에서 보여집니다.</div>
      </div>
    </div>
  );
}

export default MyPage;

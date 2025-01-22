import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Slider from 'react-slick';
import SearchImage from "./SearchImage.jsx";
import "./MyPage.css";

const formatDateTime = (dateTimeStr) => {
  // YYYYMMDDHHMMSS 형식의 문자열을 Date 객체로 변환
  const year = dateTimeStr.substring(0, 4);
  const month = dateTimeStr.substring(4, 6);
  const day = dateTimeStr.substring(6, 8);
  const hour = dateTimeStr.substring(8, 10);
  const minute = dateTimeStr.substring(10, 12);

  return `${year}. ${month}. ${day}. ${hour}:${minute}`;
};

function MyPage() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const hash = searchParams.get("userHash");

  useEffect(() => {
    const fetchWatchHistory = async () => {
      setLoading(true);
      console.log("데이터 로딩 시작...");

      try {
        if (!hash) {
          setError("userHash가 필요합니다");
          return;
        }

        const response = await fetch(
          `http://localhost:5001/api/watch-history?userHash=${hash}`
        );
        const data = await response.json();
        console.log("쿼리 결과:", data);
        setWatchHistory(data);
        setError(null);
      } catch (error) {
        console.error("시청 기록 가져오기 오류:", error);
        setError("오류가 발생했습니다: " + error.message);
      } finally {
        setLoading(false);
        console.log("데이터 로딩 완료");
      }
    };

    fetchWatchHistory();
  }, [hash]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: false,
    arrows: true,
    variableWidth: true,  // 슬라이드 크기에 맞게 조정하여 왼쪽 정렬
    centerMode: false,    // 중앙 정렬 해제
  };
  

  return (
    <div className="mypage">
      <div className="mypage_header">
        <div className="profile_section">
          <div className="profile_icon">
            <span className="profile-placeholder">프로필</span>
          </div>
          <div className="profile_name">
            <span>수정 &gt;</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">최근 시청기록</h2>
        <div className="section_content watch-history">
          {loading ? (
            <div className="status-message">데이터를 불러오는 중...</div>
          ) : error ? (
            <div className="status-message error">{error}</div>
          ) : watchHistory && watchHistory.length > 0 ? (
            <Slider {...settings} className="slider">
              {watchHistory.map((item) => (
                <div key={item.sha2_hash} className="watch-history-item">
                  <SearchImage dbTitle={item.latest_episode} />
                </div>
              ))}
            </Slider>
            // <table className="watch-history-table">
            //   <thead>
            //     <tr>
            //       <th>콘텐츠명</th>
            //       <th>체크용</th>
            //       <th>카테고리</th>
            //       <th>마지막 시청 날짜</th>
            //       <th>시청 시간</th>
            //     </tr>
            //   </thead>
            //   <tbody>
            //     {watchHistory.map((item) => (
            //       <tr key={item.sha2_hash}>
            //         <td>{item.latest_episode}</td>
            //         <td>{extractTitle(item.latest_episode)}</td>
            //         <td>{item.category}</td>
            //         <td>{formatDateTime(item.latest_strt_dt.toString())}</td>
            //         <td>{Math.floor(item.total_use_tms / 60)}분</td>
            //       </tr>
            //     ))}
            //   </tbody>
            // </table>
          ) : (
            <div className="status-message">시청 기록이 없습니다.</div>
          )}
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">구매 리스트</h2>
        <div className="section_content">
          새 콘텐츠를 구매하거나 대여할 수 있습니다.
        </div>
      </div>

      <div className="section">
        <h2 className="section_title">찜한 콘텐츠</h2>
        <div className="section_content">
          찜한 콘텐츠가 여기에서 보여집니다.
        </div>
      </div>
    </div>
  );
}

export default MyPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendContents = ({ sha2Hash }) => {
  const [recommendedContents, setRecommendedContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!sha2Hash) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); // JWT 토큰 가져오기
        const response = await axios.get(`/api/summary-recommend/${sha2Hash}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRecommendedContents(response.data);
      } catch (err) {
        setError('추천 콘텐츠를 불러오는데 실패했습니다.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [sha2Hash]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!recommendedContents.length) return <div>추천 콘텐츠가 없습니다.</div>;

  return (
    <div className="recommended-contents">
      <h3>줄거리 기반 추천</h3>
      <div className="recommended-list">
        {recommendedContents.map((content) => (
          <div key={content.sha2_hash} className="recommended-item">
            <h4>{content.asset_nm}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendContents;

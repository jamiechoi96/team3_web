import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

const COLORS = ['#ed174d', '#4a90e2', '#50e3c2', '#f5a623', '#7ed321', '#9013fe'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-genre">{payload[0].payload.genre}</p>
        <p className="tooltip-value">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ data: genreData, loading }) => {
  const [viewingPatterns, setViewingPatterns] = useState(null);
  const [patternLoading, setPatternLoading] = useState(true);

  useEffect(() => {
    const fetchViewingPatterns = async () => {
      try {
        setPatternLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/viewing-patterns', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('시청 패턴 데이터:', response.data);  // 데이터 확인용 로그
        setViewingPatterns(response.data);
      } catch (error) {
        console.error('시청 패턴 데이터 가져오기 실패:', error);
      } finally {
        setPatternLoading(false);
      }
    };

    if (!loading) {
      fetchViewingPatterns();
    }
  }, [loading]);

  if (loading || patternLoading) {
    return (
      <div className="dashboard_loading">
        <div className="loading-spinner" />
        거의 다 분석했어요😊
      </div>
    );
  }

  if (!genreData || genreData.length === 0) {
    return <div className="dashboard_empty">시청 기록이 없습니다.</div>;
  }

  // 장르 데이터 처리
  const totalWatched = genreData.reduce((sum, item) => sum + parseInt(item.total_asset_count), 0);
  const processedData = genreData.map(item => ({
    ...item,
    genre: item.genre,
    total_percentage: ((parseInt(item.total_asset_count) / totalWatched) * 100).toFixed(1)
  }));

  const top5Data = processedData.slice(0, 5);
  const pieData = top5Data.map(item => ({
    name: item.genre,
    value: parseFloat(item.total_percentage)
  }));

  const formatDuration = (minutes) => {
    if (!minutes) return '0분';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard_row">
        <div className="dashboard_card">
          <h3>장르별 시청 비율</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => `${value}`}
                wrapperStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard_card">
          <h3>TOP 5 선호 장르</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top5Data}>
              <XAxis dataKey="genre" tick={{ fill: '#fff' }} />
              <YAxis 
                tick={{ fill: '#fff' }}
                domain={[0, 50]}
                ticks={[0, 10, 20, 30, 40, 50]}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="custom-tooltip">
                        <p className="tooltip-genre">{payload[0].payload.genre}</p>
                        <p className="tooltip-value">{`${payload[0].value}%`}</p>
                        <p className="tooltip-count">{`${payload[0].payload.total_asset_count}개 시청`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="total_percentage" fill="#ed174d" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard_row">
        <div className="dashboard_stats">
          <div className="stat_card">
            <h4>가장 선호하는 장르</h4>
            <p className="stat_value">{processedData[0]?.genre || '-'}</p>
            <p className="stat_detail">{processedData[0]?.total_percentage}% 시청</p>
          </div>
          <div className="stat_card">
            <h4>시청한 콘텐츠 수</h4>
            <p className="stat_value">{totalWatched}</p>
            <p className="stat_detail">총 시청 콘텐츠</p>
          </div>
          <div className="stat_card">
            <h4>선호 시청 시간대</h4>
            <p className="stat_value">
              {viewingPatterns?.preferredTimePeriod?.time_period || '-'}
            </p>
            <p className="stat_detail">
              {viewingPatterns?.preferredTimePeriod?.count 
                ? `${viewingPatterns.preferredTimePeriod.count}회 시청` 
                : '데이터 없음'}
            </p>
          </div>
          <div className="stat_card">
            <h4>몰아보기 성향</h4>
            <p className="stat_value">
              {viewingPatterns?.bingeWatching?.binge_percentage 
                ? `${Math.round(viewingPatterns.bingeWatching.binge_percentage)}%`
                : '-'}
            </p>
            <p className="stat_detail">
              {viewingPatterns?.bingeWatching?.binge_count 
                ? `30분 이내 재시청 ${viewingPatterns.bingeWatching.binge_count}회`
                : '데이터 없음'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

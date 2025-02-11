import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

// 더 선명하고 구분되는 색상으로 변경
const COLORS = ['#ed174d', '#4a90e2', '#50e3c2', '#f5a623', '#7ed321', '#9013fe'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-genre">{`${payload[0].name}`}</p>
        <p className="tooltip-value">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="dashboard_loading">
        <div className="loading-spinner" />
        고객님의 시청 패턴을 분석중입니다.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="dashboard_empty">데이터가 없습니다.</div>;
  }

  // 총 시청 수 계산
  const totalWatched = data.reduce((sum, item) => sum + parseInt(item.total_asset_count), 0);

  // 데이터 처리
  const processedData = data.map(item => ({
    ...item,
    genre: item.genre,
    total_percentage: ((parseInt(item.total_asset_count) / totalWatched) * 100).toFixed(1)
  }));

  // 상위 5개 장르만 선택
  const top5Data = processedData.slice(0, 5);

  // 파이 차트 데이터 준비
  const pieData = top5Data.map(item => ({
    name: item.genre,
    value: parseFloat(item.total_percentage)
  }));

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
                wrapperStyle={{
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard_card">
          <h3>TOP 5 선호 장르</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top5Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="genre"
                tick={{ fill: '#fff' }}
                axisLine={{ stroke: '#fff' }}
              />
              <YAxis
                tick={{ fill: '#fff' }}
                axisLine={{ stroke: '#fff' }}
                domain={[0, 50]}
                ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                label={{
                  value: '시청 비율 (%)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#fff'
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="total_percentage"
                fill="#ed174d"
                radius={[4, 4, 0, 0]}
                onMouseOver={(data, index) => {
                  document.querySelectorAll('.recharts-bar-rectangle').forEach((rect, i) => {
                    if (i === index) {
                      rect.style.transform = 'scaleY(1.05)';
                      rect.style.transformOrigin = 'bottom';
                      rect.style.transition = 'transform 0.2s ease';
                    }
                  });
                }}
                onMouseOut={() => {
                  document.querySelectorAll('.recharts-bar-rectangle').forEach(rect => {
                    rect.style.transform = 'scaleY(1)';
                  });
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
      </div>
    </div>
  );
};

export default Dashboard;

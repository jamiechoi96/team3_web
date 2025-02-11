import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#ed174d', '#ff4d4d', '#ff6b6b', '#ff8787', '#ffa5a5', '#6b66ff'];

const Dashboard = ({ data, loading }) => {
  if (loading) {
    return <div className="dashboard_loading">분석 중...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="dashboard_empty">데이터가 없습니다.</div>;
  }

  // 파이 차트 데이터 준비
  const pieData = data.map(item => ({
    name: item.genre,
    value: parseFloat(item.total_percentage)
  }));

  // 바 차트 데이터 준비
  const barData = [...data].reverse();

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
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
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
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="genre"
                tick={{ fill: '#fff' }}
                axisLine={{ stroke: '#fff' }}
              />
              <YAxis
                tick={{ fill: '#fff' }}
                axisLine={{ stroke: '#fff' }}
                label={{
                  value: '시청 비율 (%)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#fff'
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff'
                }}
                formatter={(value) => `${value}%`}
              />
              <Bar
                dataKey="total_percentage"
                fill="#ed174d"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard_stats">
        <div className="stat_card">
          <h4>가장 선호하는 장르</h4>
          <p className="stat_value">{data[0]?.genre || '-'}</p>
          <p className="stat_detail">{data[0]?.total_percentage}% 시청</p>
        </div>
        <div className="stat_card">
          <h4>시청한 콘텐츠 수</h4>
          <p className="stat_value">
            {data.reduce((sum, item) => sum + parseInt(item.total_asset_count), 0)}
          </p>
          <p className="stat_detail">총 시청 콘텐츠</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

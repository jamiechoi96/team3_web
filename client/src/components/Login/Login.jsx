import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import './Login.css';

const Login = () => {
  const [authKey, setAuthKey] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API;
  const imageUrl = 'https://image.tmdb.org/t/p/original';

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const response = await axios.get(
          `movie/popular?api_key=${API_KEY}&language=ko-KR`
        );
        const movies = response.data.results.filter(movie => movie.backdrop_path);
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setBackgroundImage(`${imageUrl}${randomMovie.backdrop_path}`);
      } catch (error) {
        console.error('영화 포스터 가져오기 실패:', error);
      }
    };

    fetchRandomMovie();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!authKey.trim()) {
      setMessage({ text: '인증 키를 입력해주세요.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sha2_hash: authKey }),
      });

      const data = await response.json();
      console.log('로그인 응답:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage({ text: '로그인 성공!', type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage({ text: data.message || '로그인 실패', type: 'error' });
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setMessage({ text: '서버 연결 오류가 발생했습니다.', type: 'error' });
    }
  };

  return (
    <div className="login-container" style={{ 
      '--background-image': `url(${backgroundImage})`
    }}>
      <div className="login-box">
        <div className="login-content">
          <div className="slogan">세상에서 단 하나뿐인 개인 맞춤형 VOD</div>
          <div className="logo-container">
            <img src="/images/VODiscovery_w.png" alt="VODiscovery Logo" className="login-logo" />
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value)}
                placeholder="콘솔 번호를 입력해주세요"
              />
            </div>
            <button type="submit" className="login-btn">로그인</button>
          </form>
          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
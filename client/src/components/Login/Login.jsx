import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [authKey, setAuthKey] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

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
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>
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
  );
};

export default Login;
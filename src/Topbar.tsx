// import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
// global state login import 해야함
// user type? import 해야함
// logic.ts import -> logout 처리

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // 로그아웃 이후 홈으로 이동
  };

  return (
    <div className="topbar">
      <Link to={'/'} className="topbar-logo">
        스누인턴
      </Link>
      <div className="topbar-auth">
        {user ? (
          <>
            <span>{user.name}님</span>
            <button onClick={handleLogout} className="btn">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to={'/signup'}>회원가입</Link>
            <Link to={'/login'}>로그인</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;

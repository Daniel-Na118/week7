import { Link } from 'react-router-dom';
import { User } from '../auth';

interface HeaderProps {
  user?: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header>
      <nav>
        <Link to="/" className="logo">
          스누인턴
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/mypage" className="nav-links">
                마이페이지
              </Link>
              <button onClick={onLogout} className="logout-button">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/signup">회원가입</Link>
              <Link to="/login">로그인</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

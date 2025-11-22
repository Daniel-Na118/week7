import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home';
import { AuthProvider, useAuth } from './auth';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import { PostProvider } from './post';
import './style.css';
// App.tsx 파일 상단에 임시로 추가하여 사용되는 것처럼 만듭니다.
import './services/auth';
import './pages/HomePage';

const AppContent = () => {
  const { user, login, logout } = useAuth();

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <AppContent />
        </PostProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

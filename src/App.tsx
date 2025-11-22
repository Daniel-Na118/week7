import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';
import { AuthProvider, useAuth } from './auth';
import { PostProvider } from './post';
import './style.css';

const AppContent = () => {
  const { user, login, logout } = useAuth();

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/signup" element={<SignupPage onLogin={login} />} />
      </Routes>
    </>
  );
}

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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth';
import Home from './Home';
import Login from './Login';
import { PostProvider } from './post';
import Signup from './Signup';
import Topbar from './Topbar';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <Topbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
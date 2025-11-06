import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Topbar from './Topbar';
import { AuthProvider } from './auth';
import { PostProvider } from './post';

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

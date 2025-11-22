import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';
import { Post, User } from '../type';

interface Profile {
  name: string;
  email: string;
  enrollYear: number;
  department: string;
}

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookmarks') {
      const fetchBookmarkedPosts = async () => {
        try {
          const response = await apiClient.get('/api/post/bookmarks');
          setBookmarkedPosts(response.data.posts);
        } catch (error) {
          console.error('Failed to fetch bookmarked posts:', error);
        }
      };
      fetchBookmarkedPosts();
    } else if (activeTab === 'info') {
      const fetchProfile = async () => {
        try {
          const response = await apiClient.get('/api/applicant/me');
          setProfile(response.data);
          setProfileExists(true);
        } catch (error: any) {
          if (error.response && error.response.data.code === 'APPLICANT_002') {
            setProfileExists(false);
          } else {
            console.error('Failed to fetch profile:', error);
          }
        }
      };
      fetchProfile();
    }
  }, [activeTab]);

  const calculateDday = (dateString: string | null | undefined) => {
    if (!dateString || dateString === '상시') return '상시';
    const endDate = new Date(dateString);
    const today = new Date();
    const utcEndDate = Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const utcToday = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const diffTime = utcEndDate - utcToday;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return '마감';
    if (diffDays === 0) return 'D-day';
    return `D-${diffDays}`;
  };

  return (
    <div>
      <h1>My Page</h1>
      <div>
        <button onClick={() => setActiveTab('bookmarks')}>
          Bookmarked Internships
        </button>
        <button onClick={() => setActiveTab('info')}>My Information</button>
      </div>
      {activeTab === 'bookmarks' && (
        <div>
          <h2>Bookmarked Internships</h2>
          {bookmarkedPosts.map((post) => (
            <div key={post.id}>
              <h3>{post.companyName}</h3>
              <p>{post.positionTitle}</p>
              <p
                style={{
                  color:
                    calculateDday(post.employmentEndDate) === '마감'
                      ? 'red'
                      : 'blue',
                }}
              >
                {calculateDday(post.employmentEndDate)}
              </p>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'info' && (
        <div>
          <h2>My Information</h2>
          {profileExists ? (
            <div>
              <p>Name: {profile?.name}</p>
              <p>Email: {profile?.email}</p>
              <p>Student ID: {profile?.enrollYear}</p>
              <p>Department: {profile?.department}</p>
              <Link to="/profile">Edit Profile</Link>
            </div>
          ) : (
            <div>
              <p>You have not created a profile yet.</p>
              <Link to="/profile">Create Profile</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPage;

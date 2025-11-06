
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import apiClient from './api';
import type { Post } from './type';

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  paginator: number;
  fetchPosts: (query: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginator, setPaginator] = useState(1);

  const fetchPosts = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/api/recruit?${query}`);
      console.log('API Response:', response.data);
      setPosts(response.data.data);
      setPaginator(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleBookmark = async (postId: string) => {
    try {
      await apiClient.post(`/api/recruit/${postId}/bookmark`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  return (
    <PostContext.Provider
      value={{ posts, isLoading, paginator, fetchPosts, toggleBookmark }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const encodeQueryParams = (params: Record<string, any>) => {
  return new URLSearchParams(params).toString();
};

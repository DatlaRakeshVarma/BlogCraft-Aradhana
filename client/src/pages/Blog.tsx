import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPost, toggleLike, addComment, deleteComment } from '../store/slices/postSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentPost, isLoading, error } = useAppSelector((state) => state.posts);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
    }
    // Fetch current user data if authenticated but user data is missing
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, id, isAuthenticated, user]);

  const handleLike = () => {
    if (isAuthenticated) {
      dispatch(toggleLike(id!));
    } else {
      navigate('/login');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    dispatch(addComment({ id: id!, content: commentText }));
    setCommentText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment({ postId: id!, commentId }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!currentPost) {
    return null;
  }
  // Deduplicate comments by ID to avoid duplicate keys
  const uniqueComments = Array.from(
    new Map(currentPost.comments.map(c => [c._id, c])).values()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="hover:scale-105 transition-transform duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-4">{currentPost.title}</h1>
        {currentPost.imageUrl && (
          <img
            src={currentPost.imageUrl}
            alt={currentPost.title}
            className="w-full mb-6 rounded-lg"
          />
        )}
        <div className="prose max-w-none text-gray-800">
          {currentPost.content.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        {/* Likes and Comments Controls */}
        <div className="flex items-center space-x-6 mt-6">
          <button onClick={handleLike} className="flex items-center space-x-1 text-gray-700 hover:text-red-500">
            <Heart className="w-5 h-5" />
            <span>{currentPost.likeCount}</span>
          </button>
          <span className="text-gray-600">{currentPost.commentCount} comments</span>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {uniqueComments.map((c) => (
            <div key={c._id} className="mb-4 p-4 bg-white shadow rounded">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-800 mb-1"><strong>{c.user.name}</strong>:</p>
                  <p className="text-gray-700">{c.content}</p>
                </div>
                {/* Show delete button only if user owns the comment */}
                {isAuthenticated && user && c.user._id === user._id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(c._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mt-4">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                className="w-full mb-2"
                rows={3}
              />
              <Button type="submit">Add Comment</Button>
            </form>
          ) : (
            <p className="text-gray-600 mt-4">
              <a href="/login" className="text-indigo-600 hover:underline">Log in</a> to add comments.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;

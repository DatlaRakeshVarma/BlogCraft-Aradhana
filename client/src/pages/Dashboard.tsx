import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PenTool, Eye, MessageCircle, Heart, Plus, Edit, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchMyPosts, deletePost, toggleLike } from '../store/slices/postSlice';
import { logout } from '../store/slices/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { myPosts, isLoading } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchMyPosts({}));
  }, [dispatch]);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(postId));
    }
  };

  const handleLike = async (postId: string) => {
    dispatch(toggleLike(postId));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const totalViews = myPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = myPosts.reduce((sum, post) => sum + post.likeCount, 0);
  const totalComments = myPosts.reduce((sum, post) => sum + post.commentCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80"
                onClick={() => navigate('/')}
              >
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/blogs')}
              className="hover:scale-105 transition-transform duration-200"
            >
              All Blogs
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="hover:scale-105 transition-transform duration-200"
            >
              Logout
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-transform duration-200"
              onClick={() => navigate('/create-post')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myPosts.length}</div>
              <p className="text-xs text-muted-foreground">
                {myPosts.filter(p => p.published).length} published
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Across all posts
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes}</div>
              <p className="text-xs text-muted-foreground">
                From your readers
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComments}</div>
              <p className="text-xs text-muted-foreground">
                Engagement count
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Posts</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/create-post')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>

          {myPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Start writing your first blog post!</p>
                <Button 
                  onClick={() => navigate('/create-post')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myPosts.map((post) => (
                <Card key={post._id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-xl hover:text-indigo-600 cursor-pointer">
                            {post.title}
                          </CardTitle>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{post.excerpt}</p>
                        <p className="text-sm text-gray-500">
                          Created on {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/edit-post/${post._id}`)}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePost(post._id)}
                          className="hover:scale-105 transition-transform duration-200 hover:bg-red-50 hover:border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views} views</span>
                      </div>
                      <button 
                        onClick={() => handleLike(post._id)}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            post.likes?.some(like => like.user === user?._id) 
                              ? 'fill-red-500 text-red-500' 
                              : 'hover:text-red-500'
                          }`} 
                        />
                        <span>{post.likeCount} likes</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount} comments</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

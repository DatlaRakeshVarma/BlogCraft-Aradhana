import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PenTool, Search, Heart, MessageCircle, Eye, Calendar, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPosts, setFilters, toggleLike } from '../store/slices/postSlice';

const Blogs = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { posts, isLoading, filters } = useAppSelector((state) => state.posts);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts({ published: true }));
  }, [dispatch]);

  const handleSearch = (search: string) => {
    dispatch(setFilters({ search }));
    dispatch(fetchPosts({ search, published: true }));
  };

  const handleTagFilter = (tag: string) => {
    dispatch(setFilters({ tag }));
    dispatch(fetchPosts({ tag, published: true }));
  };

  const handleLike = (postId: string) => {
    if (isAuthenticated) {
      dispatch(toggleLike(postId));
    } else {
      navigate('/login');
    }
  };

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

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
            <div
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
              onClick={() => navigate('/')}
            >
              <PenTool className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold cursor-pointer">All Blogs</h1>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-transform duration-200"
          >
            Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search blogs..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 transition-all duration-200 focus:scale-[1.02]"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.tag === '' ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagFilter('')}
              className="hover:scale-105 transition-transform duration-200"
            >
              All Topics
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={filters.tag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagFilter(tag)}
                className="hover:scale-105 transition-transform duration-200"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <Card 
              key={post._id} 
              className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-md animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/blog/${post._id}`)}
            >
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardTitle className="text-xl hover:text-indigo-600 transition-colors duration-200">
                  {post.title}
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <button 
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likeCount}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <PenTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;

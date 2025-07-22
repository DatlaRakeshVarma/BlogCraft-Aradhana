import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Users, MessageCircle, Heart, Sparkles, ArrowRight, Code, Database, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: PenTool,
      title: "Create & Edit",
      description: "Write beautiful blog posts with our intuitive editor"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a community of passionate writers and readers"
    },
    {
      icon: MessageCircle,
      title: "Comments",
      description: "Engage with readers through comments and discussions"
    },
    {
      icon: Heart,
      title: "Likes",
      description: "Show appreciation for posts you love"
    },
    {
      icon: Sparkles,
      title: "AI Powered",
      description: "Get content suggestions powered by Gemini AI"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BlogCraft
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" onClick={() => navigate('/create-post')}>
                  New Post
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" onClick={() => navigate('/signup')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="secondary" className="mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            <span className="text-4xl md:text-6xl">Blog Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A modern, AI-powered fully functional blogging platform. <br />
            Create, share, and engage with beautiful content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-3 hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(isAuthenticated ? '/create-post' : '/signup')}
            >
              {isAuthenticated ? 'Start Writing' : 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 hover:scale-105 transition-transform duration-200"
              onClick={() => navigate('/blogs')}
            >
              Explore Blogs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-lg">
            Built with modern technologies and best practices
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">Go forth and build with innovation.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

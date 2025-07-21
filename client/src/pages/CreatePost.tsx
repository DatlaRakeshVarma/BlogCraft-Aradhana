import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PenTool, Sparkles, Save, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createPost } from '../store/slices/postSlice';
import React from 'react';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    tags: '',
    published: false
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    if (error) {
      // Parse validation errors if provided
      if (typeof error === 'object' && Array.isArray((error as any).errors)) {
        setValidationErrors((error as any).errors.map((e: any) => e.msg));
      } else {
        setValidationErrors([error as string]);
      }
      console.error('Create post error:', error);
    } else {
      setValidationErrors([]);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateAIContent = async () => {
    if (!formData.title.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiContent = `# ${formData.title}

Welcome to this comprehensive guide about ${formData.title.toLowerCase()}. In this article, we'll explore the key concepts, best practices, and practical examples.

## Introduction

In today's rapidly evolving digital landscape, understanding ${formData.title.toLowerCase()} has become essential for developers and tech enthusiasts alike. This topic encompasses various aspects that are crucial for modern development.

## Key Points

1. **Fundamentals**: Understanding the core concepts
2. **Best Practices**: Following industry standards
3. **Implementation**: Practical examples and code snippets
4. **Future Trends**: What to expect in the coming years

## Deep Dive

Let's explore the technical aspects in detail. When working with ${formData.title.toLowerCase()}, it's important to consider the following factors:

- Performance optimization
- Scalability considerations
- Security implications
- User experience impact

## Conclusion

${formData.title} represents an important aspect of modern development. By following the guidelines and best practices outlined in this article, you'll be well-equipped to implement these concepts in your own projects.

Thank you for reading! Feel free to share your thoughts and experiences in the comments below.`;

      setFormData(prev => ({
        ...prev,
        content: aiContent
      }));

    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    const postData = {
      ...formData,
      published: publish,
      excerpt: formData.content.substring(0, 200) + '...'
    };

    const result = await dispatch(createPost(postData));
    if (createPost.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="hover:scale-105 transition-transform duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                onClick={() => navigate('/')}
              >
                <PenTool className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold">Create New Post</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={generateAIContent}
              disabled={isGenerating}
              className="hover:scale-105 transition-transform duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "AI Assistant"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={(e) => handleSubmit(e, false)}
              className="hover:scale-105 transition-transform duration-200"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              type="button" 
              onClick={(e) => handleSubmit(e, true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-transform duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center space-x-2">
              <PenTool className="w-6 h-6 text-indigo-600" />
              <span>Write Your Story</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                {validationErrors.map((msg, idx) => (
                  <p key={idx} className="text-sm text-red-600">{msg}</p>
                ))}
              </div>
            )}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-medium">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter an engaging title for your post..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="text-lg p-4 transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-lg font-medium">Featured Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-lg font-medium">Tags (Optional)</Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="react, javascript, web development (comma separated)"
                  value={formData.tags}
                  onChange={handleChange}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
                <p className="text-sm text-gray-500">
                  Separate tags with commas to help readers find your content
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content" className="text-lg font-medium">Content</Label>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={generateAIContent}
                    disabled={isGenerating}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Start writing your blog post content here... Use markdown formatting for rich text."
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={20}
                  className="font-mono text-sm transition-all duration-200 focus:scale-[1.01]"
                />
                <p className="text-sm text-gray-500">
                  You can use Markdown formatting (e.g., **bold**, *italic*, # headings, etc.)
                </p>
              </div>

              {formData.imageUrl && (
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Preview Image</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={formData.imageUrl} 
                      alt="Featured image preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  Cancel
                </Button>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={(e) => handleSubmit(e, false)}
                    className="hover:scale-105 transition-transform duration-200"
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-transform duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Publishing..." : "Publish Post"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;

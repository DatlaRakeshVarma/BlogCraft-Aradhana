import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchPost, updatePost } from '../store/slices/postSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PenTool, Sparkles, Save, Eye, ArrowLeft } from 'lucide-react';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentPost, isLoading, error } = useAppSelector((state) => state.posts);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    tags: '',
    published: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPost && currentPost._id === id) {
      setFormData({
        title: currentPost.title,
        content: currentPost.content,
        imageUrl: currentPost.imageUrl || '',
        tags: currentPost.tags.join(', '),
        published: currentPost.published,
      });
    }
  }, [currentPost, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateAIContent = async () => {
    if (!formData.title.trim()) return;
    // Optionally implement AI content generation
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.content.substring(0, 200) + '...',
      imageUrl: formData.imageUrl,
      tags: formData.tags,
      published: publish,
    };

    const result = await dispatch(updatePost({ id: id!, postData }));
    if (updatePost.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="hover:scale-105 transition-transform duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                onClick={() => navigate('/')}
              >
                <PenTool className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl font-bold">Edit Post</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={generateAIContent} disabled className="hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 mr-2" />Generate
            </Button>
            <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, false)} disabled={isLoading} className="hover:scale-105 transition-transform duration-200">
              <Save className="w-4 h-4 mr-2" />Save Draft
            </Button>
            <Button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-transform duration-200">
              {isLoading ? 'Updating...' : 'Publish'}
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center space-x-2">
              <PenTool className="w-6 h-6 text-indigo-600" />
              <span>Edit Your Post</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-600">{error}</p></div>}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-medium">Title</Label>
                <Input id="title" name="title" type="text" placeholder="Title" value={formData.title} onChange={handleChange} required className="text-lg p-4 transition-all duration-200 focus:scale-[1.01]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-lg font-medium">Image URL (Optional)</Label>
                <Input id="imageUrl" name="imageUrl" type="url" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="transition-all duration-200 focus:scale-[1.01]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-lg font-medium">Tags (comma separated)</Label>
                <Input id="tags" name="tags" type="text" placeholder="tags" value={formData.tags} onChange={handleChange} className="transition-all duration-200 focus:scale-[1.01]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-lg font-medium">Content</Label>
                <Textarea id="content" name="content" rows={20} placeholder="Content" value={formData.content} onChange={handleChange} required className="font-mono text-sm transition-all duration-200 focus:scale-[1.01]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;

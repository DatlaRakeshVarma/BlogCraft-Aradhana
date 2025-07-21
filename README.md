# BlogCraft - AI-Powered Blogging Platform

A modern, full-stack blogging platform built with React, Node.js, Express, MongoDB, and Socket.io, featuring real-time updates and AI-powered content generation.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure JWT-based login/signup system
- **Blog Management** - Create, edit, delete, and publish blog posts
- **Rich Content Editor** - Markdown support for formatting
- **Real-time Updates** - Live comments, likes, and post updates using Socket.io
- **Image Support** - Featured images for blog posts
- **Tag System** - Categorize posts with tags for better organization

### Interactive Features
- **Comments System** - Add, view, and delete comments on posts
- **Like System** - Like/unlike posts with real-time count updates
- **Search & Filter** - Search posts by title/content and filter by tags
- **User Dashboard** - Manage your posts, view analytics
- **Responsive Design** - Mobile-friendly interface

### AI Integration
- **AI Content Generation** - Generate blog content using AI assistance
- **Smart Suggestions** - Get content ideas and writing help

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Socket.io Client** for real-time features
- **Axios** for HTTP requests
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limiting** for API protection
- **CORS** for cross-origin requests
- **Helmet** for security headers

### Development Tools
- **Vite** for fast development and building
- **ESLint** for code linting
- **TypeScript** for type safety

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blogcraft
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
```

### 3. Environment Setup

#### Frontend (.env)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (server/.env)
Create a `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blogcraft
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:8080
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

### 5. Start the Application

#### Start Backend Server
```bash
cd server
npm start
```

#### Start Frontend Development Server
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String (optional),
  bio: String (optional),
  role: String (default: 'user'),
  createdAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  content: String,
  excerpt: String,
  imageUrl: String,
  author: ObjectId (ref: User),
  tags: [String],
  published: Boolean,
  views: Number,
  likes: [{
    user: ObjectId (ref: User),
    createdAt: Date
  }],
  comments: [{
    user: ObjectId (ref: User),
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all published posts (with pagination, search, filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, owner only)
- `DELETE /api/posts/:id` - Delete post (authenticated, owner only)
- `GET /api/posts/my-posts` - Get current user's posts (authenticated)

### Interactions
- `POST /api/posts/:id/like` - Toggle like on post (authenticated)
- `POST /api/posts/:id/comments` - Add comment to post (authenticated)
- `DELETE /api/posts/:id/comments/:commentId` - Delete comment (authenticated, owner only)

## 🌐 Real-time Features

The application uses Socket.io for real-time updates:

### Events
- `postCreated` - New post published
- `postUpdated` - Post modified
- `postDeleted` - Post removed
- `postLiked` - Post liked/unliked
- `commentAdded` - New comment added
- `commentDeleted` - Comment removed

### Connection Management
- Automatic connection on authentication
- Room-based updates for specific posts
- Graceful disconnection handling

## 📱 Frontend Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── ProtectedRoute.tsx
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── Login.tsx       # Authentication
│   ├── Signup.tsx      # Registration
│   ├── Dashboard.tsx   # User dashboard
│   ├── Blogs.tsx       # All blogs listing
│   ├── Blog.tsx        # Single blog view
│   ├── CreatePost.tsx  # New post creation
│   └── EditPost.tsx    # Post editing
├── services/           # API and external services
│   ├── api.ts          # HTTP client
│   └── socket.ts       # Socket.io client
├── store/              # Redux store
│   ├── store.ts
│   └── slices/         # Redux slices
└── lib/                # Utility functions
```

## 🖥 Backend Structure

```
server/
├── config/             # Configuration files
│   └── database.js     # MongoDB connection
├── controllers/        # Route controllers
│   ├── authController.js
│   └── postController.js
├── middleware/         # Custom middleware
│   └── auth.js         # JWT authentication
├── models/             # Mongoose models
│   ├── User.js
│   └── Post.js
├── routes/             # API routes
│   ├── auth.js
│   └── posts.js
├── scripts/            # Database scripts
│   └── seed.js
└── server.js           # Main server file
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Server-side validation for all inputs
- **Authorization Checks** - Route-level and resource-level permissions

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Mode** - Theme switching capability
- **Smooth Animations** - CSS transitions and transforms
- **Loading States** - User feedback during operations
- **Error Handling** - Graceful error messages
- **Toast Notifications** - Real-time user feedback

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
1. Set production environment variables
2. Ensure MongoDB connection
3. Deploy to your preferred platform (Heroku, DigitalOcean, AWS, etc.)

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=your_production_frontend_url
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- AI content generation is currently simulated (placeholder implementation)
- Image upload is URL-based (no file upload yet)
- Email verification not implemented

## 🔮 Future Enhancements

- [ ] File upload for images
- [ ] Email verification system
- [ ] Social media sharing
- [ ] Advanced text editor (WYSIWYG)
- [ ] Post scheduling
- [ ] User profiles with following system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

## 📞 Support

For support, email support@blogcraft.com or create an issue in this repository.

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [Socket.io](https://socket.io/) for real-time features

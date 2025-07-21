const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Post = require('../models/Post');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Full-stack developer passionate about modern web technologies.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'AI researcher and tech enthusiast exploring the future of technology.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        bio: 'Database architect with expertise in scalable systems.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        bio: 'UI/UX designer creating beautiful and functional interfaces.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ]);

    console.log('Users created:', users.length);

    // Create posts
    const posts = await Post.create([
      {
        title: 'Building Modern Web Applications with React and TypeScript',
        content: `# Building Modern Web Applications with React and TypeScript

React and TypeScript have become the go-to combination for building robust, scalable web applications. In this comprehensive guide, we'll explore how to leverage these technologies to create maintainable and type-safe applications.

## Why React and TypeScript?

React provides a component-based architecture that makes it easy to build reusable UI components. When combined with TypeScript, you get:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Better Developer Experience**: Enhanced IDE support with autocomplete and refactoring
- **Self-Documenting Code**: Types serve as documentation for your components
- **Easier Refactoring**: Confident code changes with type checking

## Setting Up Your Project

Start by creating a new React project with TypeScript:

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Component Development Best Practices

### 1. Define Clear Interfaces

Always define interfaces for your component props:

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
\`\`\`

### 2. Use Custom Hooks

Extract complex logic into custom hooks:

\`\`\`typescript
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
\`\`\`

## State Management

For complex applications, consider using Redux Toolkit with TypeScript:

\`\`\`typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
}

const initialState: UserState = {
  users: [],
  loading: false
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setUsers, setLoading } = userSlice.actions;
export default userSlice.reducer;
\`\`\`

## Testing

Write comprehensive tests for your components:

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\`

## Conclusion

React and TypeScript together provide a powerful foundation for building modern web applications. By following these best practices, you'll create applications that are not only functional but also maintainable and scalable.

Remember to:
- Always define clear interfaces
- Use TypeScript's strict mode
- Write comprehensive tests
- Keep components small and focused
- Leverage custom hooks for reusable logic

Happy coding!`,
        excerpt: 'Learn how to build scalable and maintainable web applications using React and TypeScript with modern development practices.',
        author: users[0]._id,
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        tags: ['react', 'typescript', 'web development', 'javascript'],
        published: true,
        views: 1245,
        likes: [
          { user: users[1]._id },
          { user: users[2]._id },
          { user: users[3]._id }
        ],
        comments: [
          {
            user: users[1]._id,
            content: 'Great article! The TypeScript examples are really helpful.'
          },
          {
            user: users[2]._id,
            content: 'I love how you explained the benefits of using TypeScript with React.'
          }
        ]
      },
      {
        title: 'The Future of AI in Software Development',
        content: `# The Future of AI in Software Development

Artificial Intelligence is revolutionizing the way we write, test, and maintain code. From intelligent code completion to automated testing, AI tools are becoming indispensable for modern developers.

## Current AI Tools in Development

### Code Generation
- **GitHub Copilot**: AI pair programmer that suggests code completions
- **Tabnine**: AI-powered code completion for multiple languages
- **CodeT5**: Google's code generation model

### Code Review and Quality
- **DeepCode**: AI-powered code review tool
- **SonarQube**: Static code analysis with AI insights
- **Codacy**: Automated code quality analysis

## The Impact on Developer Productivity

AI tools are already showing significant impact:

1. **Faster Development**: Developers report 30-50% faster coding with AI assistance
2. **Reduced Bugs**: AI can catch common patterns that lead to bugs
3. **Learning Acceleration**: Junior developers learn faster with AI guidance
4. **Documentation**: Automatic generation of code documentation

## Challenges and Considerations

### Code Quality Concerns
While AI can generate code quickly, developers must still:
- Review and understand generated code
- Ensure code follows best practices
- Maintain code security standards

### Dependency on AI
There's a risk of over-reliance on AI tools:
- Developers might lose fundamental coding skills
- Understanding of underlying concepts may diminish
- Critical thinking in problem-solving could be affected

## Future Predictions

### Next 5 Years
- AI will become standard in all IDEs
- Natural language to code conversion will improve dramatically
- AI-powered debugging will become mainstream

### Long-term Vision
- AI architects that can design entire systems
- Automated code migration between technologies
- Self-healing applications that fix bugs automatically

## Preparing for the AI-Driven Future

As developers, we should:

1. **Embrace AI Tools**: Learn to use them effectively
2. **Maintain Core Skills**: Don't lose fundamental programming knowledge
3. **Focus on Problem-Solving**: AI handles syntax, we handle logic
4. **Stay Updated**: The AI landscape changes rapidly

## Conclusion

AI in software development is not about replacing developers—it's about augmenting our capabilities. The future belongs to developers who can effectively collaborate with AI to build better software faster.

The key is finding the right balance between leveraging AI assistance and maintaining our core development skills. As AI continues to evolve, so must we.`,
        excerpt: 'Discover how AI tools like Gemini and GPT are revolutionizing software development and what it means for developers.',
        author: users[1]._id,
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        tags: ['ai', 'machine learning', 'development tools', 'future tech'],
        published: true,
        views: 892,
        likes: [
          { user: users[0]._id },
          { user: users[2]._id }
        ],
        comments: [
          {
            user: users[0]._id,
            content: 'Fascinating insights! I\'ve been using GitHub Copilot and it\'s amazing.'
          }
        ]
      },
      {
        title: 'Database Design Best Practices for Scalable Applications',
        content: `# Database Design Best Practices for Scalable Applications

Building applications that can handle millions of users requires careful database design from the start. Here are the essential principles and practices for creating scalable database architectures.

## Fundamental Design Principles

### 1. Normalization vs. Denormalization

**Normalization Benefits:**
- Eliminates data redundancy
- Ensures data consistency
- Reduces storage requirements
- Simplifies data maintenance

**When to Denormalize:**
- Read-heavy applications
- Performance is critical
- Complex joins are expensive
- Data consistency can be eventually consistent

### 2. Indexing Strategy

Proper indexing is crucial for performance:

\`\`\`sql
-- Primary key index (automatic)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Composite index for common queries
CREATE INDEX idx_user_email_created 
ON users(email, created_at);

-- Partial index for specific conditions
CREATE INDEX idx_active_users 
ON users(id) WHERE active = true;
\`\`\`

## Scalability Patterns

### Horizontal Partitioning (Sharding)

Distribute data across multiple databases:

\`\`\`python
def get_shard_key(user_id):
    return user_id % NUM_SHARDS

def get_user_db(user_id):
    shard = get_shard_key(user_id)
    return database_connections[shard]
\`\`\`

### Vertical Partitioning

Split tables by columns:
- Frequently accessed columns in one table
- Less frequently accessed columns in another
- Binary data (images, documents) in separate storage

### Read Replicas

Distribute read load across multiple database instances:

\`\`\`javascript
class DatabaseManager {
  constructor() {
    this.writeDB = new Database(WRITE_DB_URL);
    this.readDBs = [
      new Database(READ_DB_1_URL),
      new Database(READ_DB_2_URL),
      new Database(READ_DB_3_URL)
    ];
  }

  async read(query) {
    const randomDB = this.readDBs[
      Math.floor(Math.random() * this.readDBs.length)
    ];
    return await randomDB.query(query);
  }

  async write(query) {
    return await this.writeDB.query(query);
  }
}
\`\`\`

## Performance Optimization

### Query Optimization

1. **Use EXPLAIN to analyze queries**
2. **Avoid N+1 queries**
3. **Use appropriate JOIN types**
4. **Limit result sets**

\`\`\`sql
-- Bad: N+1 query
SELECT * FROM posts;
-- Then for each post:
SELECT * FROM users WHERE id = post.user_id;

-- Good: Single query with JOIN
SELECT p.*, u.name, u.email 
FROM posts p 
JOIN users u ON p.user_id = u.id;
\`\`\`

### Connection Pooling

Manage database connections efficiently:

\`\`\`javascript
const pool = new Pool({
  host: 'localhost',
  user: 'database-user',
  password: 'secretpassword',
  database: 'my-app',
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

## Data Consistency Strategies

### ACID Properties
- **Atomicity**: All or nothing transactions
- **Consistency**: Data integrity constraints
- **Isolation**: Concurrent transaction handling
- **Durability**: Permanent data storage

### CAP Theorem
Choose two of three:
- **Consistency**: All nodes see the same data
- **Availability**: System remains operational
- **Partition tolerance**: System continues despite network failures

## Monitoring and Maintenance

### Key Metrics to Monitor
- Query execution time
- Connection pool usage
- Index usage statistics
- Database size growth
- Replication lag

### Regular Maintenance Tasks
- Update table statistics
- Rebuild fragmented indexes
- Archive old data
- Monitor slow query logs

## Technology Choices

### SQL Databases
- **PostgreSQL**: Feature-rich, ACID compliant
- **MySQL**: Fast, widely supported
- **SQL Server**: Enterprise features, Windows integration

### NoSQL Databases
- **MongoDB**: Document-based, flexible schema
- **Redis**: In-memory, high performance
- **Cassandra**: Distributed, high availability

## Conclusion

Scalable database design requires careful planning and continuous optimization. Key takeaways:

1. **Plan for scale from the beginning**
2. **Choose the right database technology**
3. **Implement proper indexing strategies**
4. **Monitor performance continuously**
5. **Design for your specific use case**

Remember: premature optimization is the root of all evil, but planning for scalability is essential for long-term success.`,
        excerpt: 'Master the art of database design with proven strategies for building systems that can handle millions of users.',
        author: users[2]._id,
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
        tags: ['database', 'postgresql', 'architecture', 'scalability'],
        published: true,
        views: 567,
        likes: [
          { user: users[0]._id },
          { user: users[1]._id }
        ],
        comments: [
          {
            user: users[1]._id,
            content: 'Excellent breakdown of database scaling strategies!'
          }
        ]
      },
      {
        title: 'Creating Beautiful UIs with Shadcn/ui and Tailwind CSS',
        content: `# Creating Beautiful UIs with Shadcn/ui and Tailwind CSS

Modern web applications demand beautiful, accessible, and performant user interfaces. Shadcn/ui combined with Tailwind CSS provides the perfect toolkit for creating stunning UIs with minimal effort.

## What is Shadcn/ui?

Shadcn/ui is a collection of reusable components built using Radix UI and Tailwind CSS. Unlike traditional component libraries, shadcn/ui gives you:

- **Copy-paste components**: Own your code completely
- **Customizable**: Modify components to fit your design
- **Accessible**: Built on Radix UI primitives
- **Type-safe**: Full TypeScript support

## Getting Started

### Installation

\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

### Adding Components

\`\`\`bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
\`\`\`

## Building Your First Component

Let's create a user profile card:

\`\`\`tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    role: string;
    bio: string;
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
        <Badge variant="secondary">{user.role}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{user.bio}</p>
        <div className="flex space-x-2">
          <Button className="flex-1">Follow</Button>
          <Button variant="outline" className="flex-1">Message</Button>
        </div>
      </CardContent>
    </Card>
  )
}
\`\`\`

## Advanced Patterns

### Custom Variants

Extend components with custom variants:

\`\`\`tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)
\`\`\`

### Dark Mode Support

Shadcn/ui comes with built-in dark mode support:

\`\`\`tsx
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">My App</h1>
            <ModeToggle />
          </div>
        </header>
        <main className="container py-8">
          {/* Your app content */}
        </main>
      </div>
    </ThemeProvider>
  )
}
\`\`\`

## Form Handling

Create beautiful forms with validation:

\`\`\`tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
\`\`\`

## Animation and Interactions

Add smooth animations with Framer Motion:

\`\`\`tsx
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="cursor-pointer">
        {children}
      </Card>
    </motion.div>
  )
}
\`\`\`

## Best Practices

### 1. Consistent Spacing
Use Tailwind's spacing scale consistently:
- \`space-y-4\` for vertical spacing
- \`gap-4\` for grid/flex gaps
- \`p-4\`, \`px-6\`, \`py-2\` for padding

### 2. Color System
Stick to the design system colors:
- \`text-foreground\` for primary text
- \`text-muted-foreground\` for secondary text
- \`bg-background\` for backgrounds
- \`border\` for borders

### 3. Responsive Design
Use Tailwind's responsive prefixes:
\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
\`\`\`

### 4. Accessibility
Always include proper ARIA labels and keyboard navigation:
\`\`\`tsx
<Button
  aria-label="Close dialog"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</Button>
\`\`\`

## Conclusion

Shadcn/ui and Tailwind CSS provide a powerful combination for building modern UIs. Key benefits:

- **Developer Experience**: Fast development with great DX
- **Customization**: Full control over your components
- **Accessibility**: Built-in accessibility features
- **Performance**: Optimized CSS output
- **Consistency**: Design system approach

Start building beautiful UIs today with this powerful toolkit!`,
        excerpt: 'Transform your web applications with beautiful, accessible components using Shadcn/ui and Tailwind CSS.',
        author: users[3]._id,
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
        tags: ['ui/ux', 'tailwind css', 'design systems', 'react'],
        published: true,
        views: 734,
        likes: [
          { user: users[0]._id },
          { user: users[1]._id },
          { user: users[2]._id }
        ],
        comments: [
          {
            user: users[0]._id,
            content: 'Love the practical examples! Shadcn/ui is amazing.'
          },
          {
            user: users[2]._id,
            content: 'Great tutorial on building accessible components.'
          }
        ]
      }
    ]);

    console.log('Posts created:', posts.length);
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});
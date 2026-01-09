# Blog Supabase Setup Guide

This guide will help you set up the Supabase database for the OneLifetime.World blog system.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 16 or higher
3. **Environment Variables**: Supabase credentials

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., "onelifetime-blog")
3. Set a strong database password
4. Select a region (preferably EU for GDPR compliance)
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

## Step 3: Set Environment Variables

Create a `.env.local` file in the `onelifetime.world` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-key
```

**Important**: Never commit the `.env.local` file to Git! It should be in `.gitignore`.

## Step 4: Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire SQL schema from `lib/blog-supabase.ts` (the `BLOG_SCHEMA` constant)
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

This will create:
- `blog_posts` table
- `blog_categories` table
- `blog_tags` table
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic updates

## Step 5: Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see three new tables:
   - `blog_posts`
   - `blog_categories`
   - `blog_tags`

## Step 6: Import Existing Blog Posts

Install required dependencies:

```bash
cd onelifetime.world
npm install gray-matter @supabase/supabase-js
npm install --save-dev @types/node ts-node
```

Run the import script:

```bash
# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_KEY=eyJhbGc...your-service-key

# Run import
npx ts-node scripts/import-blog-posts.ts
```

This will:
- Read all markdown files from `Admin/Sites-Archive/sites/lifetime-fi/content/posts/`
- Parse frontmatter and content
- Import posts to Supabase
- Extract and create categories
- Extract and create tags

Expected output:
```
🚀 Starting blog post import...
📂 Reading blog posts from: ...
📄 Found 767 markdown files
✅ Imported: Blog the mention
✅ Imported: Climate change third edition
...
📊 Import Summary:
✅ Successfully imported: 767
⏭️  Skipped (already exists): 0
❌ Errors: 0
📝 Total processed: 767
```

## Step 7: Test the API

You can test the blog API using the Supabase dashboard:

1. Go to **Table Editor** → **blog_posts**
2. You should see all imported posts
3. Click on any post to view details

Or use the API directly:

```typescript
import { getAllPosts, getPostBySlug } from './lib/blog-supabase';

// Get all posts
const posts = await getAllPosts(10, 0);

// Get a specific post
const post = await getPostBySlug('2007-11-8-blog-the-mention');
```

## Step 8: Update Blog Index Page

The blog index page (`blog/index.html`) needs to be updated to fetch from Supabase instead of static HTML.

See `blog/index-dynamic.html` for a complete example using vanilla JavaScript.

## API Functions

### Public Functions (No Authentication Required)

- `getAllPosts(limit, offset)` - Get paginated list of published posts
- `getPostBySlug(slug)` - Get a single post by slug
- `getPostsByCategory(categorySlug, limit)` - Get posts in a category
- `getPostsByTag(tagSlug, limit)` - Get posts with a tag
- `searchPosts(query, limit)` - Search posts by title/content
- `getAllCategories()` - Get all categories
- `getAllTags()` - Get all tags
- `getPopularPosts(limit)` - Get most viewed posts
- `getRecentPosts(limit)` - Get recently published posts

### Admin Functions (Authentication Required)

- `createPost(post)` - Create a new blog post
- `updatePost(id, updates)` - Update an existing post
- `deletePost(id)` - Delete a post

## Security

### Row Level Security (RLS)

The database uses RLS to ensure:
- **Public users** can only read published posts
- **Authenticated users** can manage all posts
- Categories and tags are publicly readable

### Authentication

To enable admin functions:
1. Go to **Authentication** in Supabase dashboard
2. Enable **Email** provider
3. Create admin users
4. Use Supabase Auth in your admin interface

## Performance Optimization

The schema includes:
- **Indexes** on frequently queried columns (slug, status, dates)
- **GIN indexes** for array fields (tags, categories)
- **Full-text search index** for content search
- **Materialized views** for aggregated data
- **Automatic triggers** for updating counts

## Backup and Maintenance

### Automated Backups

Supabase automatically backs up your database daily. You can also:

1. Go to **Database** → **Backups**
2. View backup history
3. Restore from a backup if needed

### Manual Backup

Export data via SQL:

```sql
-- Export all posts
COPY (SELECT * FROM blog_posts) TO '/tmp/blog_posts.csv' CSV HEADER;
```

## Troubleshooting

### Import Fails

- **Check credentials**: Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct
- **Check RLS policies**: Service key should bypass RLS
- **Check file paths**: Ensure markdown files exist in the specified directory

### Posts Not Showing

- **Check status**: Only posts with `status = 'published'` are publicly visible
- **Check RLS**: Public users can only see published posts
- **Check dates**: Posts with future dates won't show in chronological order

### Slow Queries

- **Check indexes**: Ensure indexes are created
- **Use pagination**: Always use `limit` and `offset`
- **Cache results**: Consider caching popular queries

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Create database tables
3. ✅ Import existing blog posts
4. 🔄 Update blog index page to fetch from Supabase
5. 🔄 Create dynamic blog post detail pages
6. 🔄 Build admin interface for managing posts
7. 🔄 Add search functionality
8. 🔄 Implement RSS feed
9. 🔄 Add comments system (optional)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Full-Text Search](https://supabase.com/docs/guides/database/full-text-search)

## Support

For issues or questions:
- Email: risto@lifetime.fi
- GitHub: Create an issue in the repository
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)

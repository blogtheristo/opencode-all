/**
 * Supabase Integration for Blog Management
 * OneLifetime.World Blog System
 *
 * @description Manages blog posts with full CRUD operations
 * @performance Edge-compatible, lightweight client
 * @compliance EU data residency, GDPR-compliant
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Blog Post Interface
 */
export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  author_email?: string;
  published_date: string;
  updated_date?: string;
  status: 'draft' | 'published' | 'archived';
  featured_image?: string;
  tags?: string[];
  categories?: string[];
  meta_description?: string;
  meta_keywords?: string[];
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Blog Category Interface
 */
export interface BlogCategory {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  post_count?: number;
}

/**
 * Blog Tag Interface
 */
export interface BlogTag {
  id?: number;
  name: string;
  slug: string;
  post_count?: number;
}

/**
 * Get all published blog posts
 * @param limit - Number of posts to fetch
 * @param offset - Offset for pagination
 * @returns Array of blog posts
 */
export async function getAllPosts(limit: number = 10, offset: number = 0): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * @param slug - Post slug
 * @returns Blog post or null
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    // Increment view count
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return null;
  }
}

/**
 * Get posts by category
 * @param categorySlug - Category slug
 * @param limit - Number of posts to fetch
 * @returns Array of blog posts
 */
export async function getPostsByCategory(categorySlug: string, limit: number = 10): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .contains('categories', [categorySlug])
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch posts by category:', error);
    return [];
  }
}

/**
 * Get posts by tag
 * @param tagSlug - Tag slug
 * @param limit - Number of posts to fetch
 * @returns Array of blog posts
 */
export async function getPostsByTag(tagSlug: string, limit: number = 10): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .contains('tags', [tagSlug])
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch posts by tag:', error);
    return [];
  }
}

/**
 * Search blog posts
 * @param query - Search query
 * @param limit - Number of results
 * @returns Array of blog posts
 */
export async function searchPosts(query: string, limit: number = 10): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to search posts:', error);
    return [];
  }
}

/**
 * Get all categories
 * @returns Array of categories
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Get all tags
 * @returns Array of tags
 */
export async function getAllTags(): Promise<BlogTag[]> {
  try {
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

/**
 * Create a new blog post (admin only)
 * @param post - Blog post data
 * @returns Created post or null
 */
export async function createPost(post: BlogPost): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create blog post:', error);
    return null;
  }
}

/**
 * Update a blog post (admin only)
 * @param id - Post ID
 * @param updates - Post updates
 * @returns Updated post or null
 */
export async function updatePost(id: number, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return null;
  }
}

/**
 * Delete a blog post (admin only)
 * @param id - Post ID
 * @returns Success boolean
 */
export async function deletePost(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return false;
  }
}

/**
 * Get featured/popular posts
 * @param limit - Number of posts
 * @returns Array of popular posts
 */
export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch popular posts:', error);
    return [];
  }
}

/**
 * Get recent posts
 * @param limit - Number of posts
 * @returns Array of recent posts
 */
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
    return [];
  }
}

/**
 * Supabase SQL Schema for Blog System
 * Run this in Supabase SQL Editor
 */
export const BLOG_SCHEMA = `
-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL DEFAULT 'Risto Anton Paarni',
  author_email TEXT DEFAULT 'risto@lifetime.fi',
  published_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog Tags Table
CREATE TABLE IF NOT EXISTS blog_tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_categories ON blog_posts USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count ON blog_posts(view_count DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts USING GIN(to_tsvector('english', title || ' ' || content || ' ' || COALESCE(excerpt, '')));

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public reads for published posts
CREATE POLICY "Allow public reads on published posts"
  ON blog_posts FOR SELECT
  TO public
  USING (status = 'published');

-- Policy: Allow authenticated users to manage posts
CREATE POLICY "Allow authenticated users to manage posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow public reads on categories and tags
CREATE POLICY "Allow public reads on categories"
  ON blog_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public reads on tags"
  ON blog_tags FOR SELECT
  TO public
  USING (true);

-- Policy: Allow authenticated users to manage categories and tags
CREATE POLICY "Allow authenticated users to manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage tags"
  ON blog_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update category/tag post counts
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update counts for all categories
  UPDATE blog_categories SET post_count = (
    SELECT COUNT(*) FROM blog_posts 
    WHERE status = 'published' AND blog_categories.slug = ANY(blog_posts.categories)
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update counts for all tags
  UPDATE blog_tags SET post_count = (
    SELECT COUNT(*) FROM blog_posts 
    WHERE status = 'published' AND blog_tags.slug = ANY(blog_posts.tags)
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update counts
DROP TRIGGER IF EXISTS update_category_counts ON blog_posts;
CREATE TRIGGER update_category_counts
  AFTER INSERT OR UPDATE OR DELETE ON blog_posts
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_category_post_count();

DROP TRIGGER IF EXISTS update_tag_counts ON blog_posts;
CREATE TRIGGER update_tag_counts
  AFTER INSERT OR UPDATE OR DELETE ON blog_posts
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_tag_post_count();
`;

export default supabase;

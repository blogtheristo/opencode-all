/**
 * Blog Post Migration Script
 * Imports blog posts from markdown files to Supabase
 * 
 * Usage: ts-node scripts/import-blog-posts.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
  process.exit(1);
}

// Initialize Supabase client with service key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface BlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  published_date: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  categories?: string[];
}

/**
 * Parse markdown file and extract frontmatter
 */
function parseMarkdownFile(filePath: string): BlogPostData | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Generate slug from filename or use frontmatter slug
    const fileName = path.basename(filePath, '.md').replace('.html', '');
    const slug = data.slug || fileName;

    // Extract title from frontmatter or content
    const title = data.title || content.split('\n')[0].replace(/^#\s*/, '').trim() || 'Untitled';

    // Generate excerpt (first 200 characters of content)
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
    const excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');

    // Parse date from frontmatter or filename
    let publishedDate = new Date();
    if (data.date) {
      publishedDate = new Date(data.date);
    } else {
      // Try to extract date from filename (format: YYYY-M-D-...)
      const dateMatch = fileName.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (dateMatch) {
        publishedDate = new Date(`${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`);
      }
    }

    return {
      title,
      slug,
      content,
      excerpt,
      author: data.author || 'Risto Anton Paarni',
      published_date: publishedDate.toISOString(),
      status: data.status || 'published',
      tags: data.tags || [],
      categories: data.categories || [],
    };
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    return null;
  }
}

/**
 * Import all blog posts from directory
 */
async function importBlogPosts(directory: string) {
  console.log(`📂 Reading blog posts from: ${directory}`);

  const files = fs.readdirSync(directory).filter(file => file.endsWith('.md'));
  console.log(`📄 Found ${files.length} markdown files`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const filePath = path.join(directory, file);
    const postData = parseMarkdownFile(filePath);

    if (!postData) {
      errorCount++;
      continue;
    }

    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postData.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping existing post: ${postData.title}`);
        skippedCount++;
        continue;
      }

      // Insert post
      const { error } = await supabase
        .from('blog_posts')
        .insert([postData]);

      if (error) {
        console.error(`❌ Error importing ${file}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Imported: ${postData.title}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error importing ${file}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`⏭️  Skipped (already exists): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📝 Total processed: ${files.length}`);
}

/**
 * Extract and create categories from posts
 */
async function extractCategories() {
  console.log('\n📁 Extracting categories from posts...');

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('categories')
    .not('categories', 'is', null);

  if (!posts) return;

  const categorySet = new Set<string>();
  posts.forEach(post => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach((cat: string) => categorySet.add(cat));
    }
  });

  console.log(`Found ${categorySet.size} unique categories`);

  for (const category of categorySet) {
    const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    try {
      const { error } = await supabase
        .from('blog_categories')
        .insert([{ name: category, slug }])
        .select();

      if (error && !error.message.includes('duplicate')) {
        console.error(`Error creating category ${category}:`, error.message);
      } else if (!error) {
        console.log(`✅ Created category: ${category}`);
      }
    } catch (error) {
      // Ignore duplicate errors
    }
  }
}

/**
 * Extract and create tags from posts
 */
async function extractTags() {
  console.log('\n🏷️  Extracting tags from posts...');

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('tags')
    .not('tags', 'is', null);

  if (!posts) return;

  const tagSet = new Set<string>();
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag: string) => tagSet.add(tag));
    }
  });

  console.log(`Found ${tagSet.size} unique tags`);

  for (const tag of tagSet) {
    const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    try {
      const { error } = await supabase
        .from('blog_tags')
        .insert([{ name: tag, slug }])
        .select();

      if (error && !error.message.includes('duplicate')) {
        console.error(`Error creating tag ${tag}:`, error.message);
      } else if (!error) {
        console.log(`✅ Created tag: ${tag}`);
      }
    } catch (error) {
      // Ignore duplicate errors
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting blog post import...\n');

  // Path to blog posts directory
  const postsDirectory = path.join(__dirname, '../../Admin/Sites-Archive/sites/lifetime-fi/content/posts');

  if (!fs.existsSync(postsDirectory)) {
    console.error(`❌ Directory not found: ${postsDirectory}`);
    process.exit(1);
  }

  // Import posts
  await importBlogPosts(postsDirectory);

  // Extract categories and tags
  await extractCategories();
  await extractTags();

  console.log('\n✨ Import complete!');
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

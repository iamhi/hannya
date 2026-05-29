// Simple frontmatter and markdown parser for our static blog.
// Works entirely at build/run time with Vite's import.meta.glob.

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  coverImage: string;
  author: string;
  tags: string[];
  content: string;
}

// Custom parser to extract metadata (YAML frontmatter) and content from markdown
function parseMarkdown(filePath: string, rawContent: string): BlogPost {
  // Extract slug from file path (e.g., "/src/blogs/future-of-web.md" -> "future-of-web")
  const slug = filePath.split('/').pop()?.replace('.md', '') || 'unknown';

  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.trim().match(frontmatterRegex);

  if (!match) {
    return {
      slug,
      title: 'Untitled Post',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      category: 'Uncategorized',
      readTime: '1 min read',
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60',
      author: 'Anonymous',
      tags: [],
      content: rawContent,
    };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();

  const metadata: Record<string, any> = {};
  yamlBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove surrounding quotes if any
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      // Handle arrays like [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key] = value
          .substring(1, value.length - 1)
          .split(',')
          .map((t) => t.trim().replace(/['"]/g, ''));
      } else {
        metadata[key] = value;
      }
    }
  });

  return {
    slug,
    title: metadata.title || 'Untitled Post',
    date: metadata.date || new Date().toISOString().split('T')[0],
    excerpt: metadata.excerpt || '',
    category: metadata.category || 'General',
    readTime: metadata.readTime || '3 min read',
    coverImage: metadata.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60',
    author: metadata.author || 'Anonymous',
    tags: metadata.tags || [],
    content,
  };
}

// Load all markdown files from src/blogs/ using Vite's glob import
export function getAllPosts(): BlogPost[] {
  // Use import.meta.glob to load all markdown files in src/blogs/ statically
  const modules = import.meta.glob('/src/blogs/*.md', {
    query: '?raw',
    eager: true,
  }) as Record<string, { default: string }>;

  const posts = Object.entries(modules).map(([filePath, module]) => {
    return parseMarkdown(filePath, module.default);
  });

  // Sort by date descending (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export function getCategories(): string[] {
  const posts = getAllPosts();
  const categories = posts.map((post) => post.category);
  return ['All', ...new Set(categories)];
}
